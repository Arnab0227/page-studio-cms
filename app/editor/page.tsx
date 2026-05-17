'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { getPages, savePage } from '@/lib/contentful';
import { ToolBar } from '@/components/editor/ToolBar';
import { ComponentPalette } from '@/components/editor/ComponentPalette';
import { DraggableCanvas } from '@/components/editor/DraggableCanvas';
import { PropertiesPanel } from '@/components/editor/PropertiesPanel';
import { EditorNavbarClient } from '@/components/editor/EditorNavbarClient';
import { setCurrentPage, selectComponent, markAsSaved, markAsSaving, clearCurrentPage } from '@/lib/store';
import type { PageModel } from '@/lib/types';
import type { RootState, AppDispatch } from '@/lib/store';
import type { UserRole } from '@/lib/auth/roles';


export default function EditorPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>('publisher');
  const [mounted, setMounted] = useState(false);

  const currentPage = useSelector((state: RootState) => state.editor.currentPage);
  const components = useSelector((state: RootState) => state.editor.components);
  const selectedComponentId = useSelector((state: RootState) => state.editor.selectedComponentId);
  const isDirty = useSelector((state: RootState) => state.editor.isDirty);
  const isSaving = useSelector((state: RootState) => state.editor.isSaving);

  useEffect(() => {
    setMounted(true);
    const savedRole = localStorage.getItem('userRole') as UserRole | null;
    if (savedRole) {
      setCurrentRole(savedRole);
    }
  }, []);

  const selectedComponent = components.find((c) => c.id === selectedComponentId) || null;

  useEffect(() => {
    const loadPages = async () => {
      try {
        const pageId = searchParams.get('id');
        console.log('[v0] Editor loading with page ID from query:', pageId);
        
        let loadedPages: PageModel[] = [];
        try {
          loadedPages = await getPages();
        } catch (contentfulErr) {
          console.log('[v0] Could not load from Contentful, will check releases or create new page');
        }
        
        if (pageId) {
          let requestedPage = loadedPages.find((p) => p.sys.id === pageId);
          
          if (!requestedPage) {
            console.log('[v0] Page not in Contentful, attempting to load from releases:', pageId);
            try {
              const response = await fetch(`/api/page/${pageId}`);
              if (response.ok) {
                const pageData = await response.json();
                if (pageData.page) {
                  console.log('[v0] Loaded page from releases:', pageData.page.fields.title);
                  dispatch(setCurrentPage(pageData.page));
                  return;
                }
              }
            } catch (releaseErr) {
              console.log('[v0] Could not load from releases:', releaseErr);
            }
          }
          
          if (requestedPage) {
            console.log('[v0] Loaded requested page:', requestedPage.fields.title);
            dispatch(setCurrentPage(requestedPage));
            return;
          } else {
            console.warn('[v0] Requested page ID not found:', pageId);
            // Fall through to load first page or create new
          }
        }
        
        // Load first existing page if available
        if (loadedPages.length > 0) {
          console.log('[v0] Loaded existing page:', loadedPages[0].fields.title);
          dispatch(setCurrentPage(loadedPages[0]));
        } else {
          const timestamp = Date.now();
          const newPageId = `page-${timestamp}`;
          const pageSlug = `page-${timestamp}`;
          
          console.log('[v0] Creating new page:', newPageId);
          const newPage: PageModel = {
            sys: {
              id: newPageId,
              type: 'Entry',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              locale: 'en-US',
              revision: 1,
              space: { sys: { id: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || '', type: 'Link', linkType: 'Space' } },
              contentType: { sys: { id: 'page', type: 'Link', linkType: 'ContentType' } },
            },
            fields: {
              title: 'Untitled Page',
              slug: pageSlug,
              components: [],
              published: false,
            },
          };
          
          try {
            await savePage(newPage);
            console.log('[v0] New page saved to Contentful:', newPageId);
          } catch (saveErr) {
            console.warn('[v0] Could not save page to Contentful (may need credentials)', saveErr);
          }
          
          dispatch(setCurrentPage(newPage));
        }
      } catch (err) {
        console.error('[v0] Error loading pages:', err);
        setError('Failed to load pages. You can still create a new page in the editor.');
      }
    };

    loadPages();
  }, [dispatch, searchParams]);

  const handleSave = async () => {
    if (!currentPage) return;

    dispatch(markAsSaving());
    try {
      const updatedPage: PageModel = {
        ...currentPage,
        fields: {
          ...currentPage.fields,
          components,
        },
      };

      await savePage(updatedPage);
      dispatch(markAsSaved());
      setError(null);
    } catch (err) {
      setError('Failed to save page. Please try again.');
      console.error('Error saving page:', err);
      dispatch(markAsSaved()); 
    }
  };

  const handlePublish = async () => {
    if (!currentPage) return;

    dispatch(markAsSaving());
    try {
      const pageToPublish: PageModel = {
        ...currentPage,
        fields: {
          ...currentPage.fields,
          components,
        },
      };

      try {
        await savePage(pageToPublish);
        console.log('[v0] Page saved before publishing');
      } catch (saveErr) {
        console.warn('[v0] Could not save to Contentful, attempting publish anyway', saveErr);
      }

      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId: pageToPublish.sys.id,
          page: pageToPublish,
          changelog: [`Published version with ${components.length} components`],
        }),
      });

      const data = await response.json();

      if (data.success) {
        dispatch(markAsSaved());
        setError(null);
        alert(`Page published as version ${data.version}!`);
      } else {
        setError(data.error || 'Failed to publish page');
        console.error('[v0] Publish error:', data);
        dispatch(markAsSaved());
      }
    } catch (err) {
      setError('Failed to publish page. Please try again.');
      console.error('[v0] Error publishing page:', err);
      dispatch(markAsSaved());
    }
  };

  const handleGoHome = () => {
    dispatch(clearCurrentPage());
    router.push('/');
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <EditorNavbarClient
        pageTitle={currentPage ? currentPage.fields.title : 'Page Editor'}
        isDraft={currentPage ? !currentPage.fields.published : true}
        isPublished={currentPage?.fields.published}
        initialRole={currentRole}
      />

      <ToolBar
        onSave={handleSave}
        onPublish={handlePublish}
        isSaving={isSaving}
        userRole={currentRole}
      />

      {error && (
        <div className="px-4 py-3 bg-red-50 border-b border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <div className="w-48 border-r border-gray-200 overflow-hidden">
          <ComponentPalette />
        </div>

        <DraggableCanvas
          onComponentSelect={(id) => {
            dispatch(selectComponent(id));
          }}
        />

        <div className="w-64 border-l border-gray-200 overflow-hidden">
          <PropertiesPanel component={selectedComponent} />
        </div>
      </div>

      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
        <div className="flex items-center justify-between">
          <span>
            {currentPage ? `Editing: ${currentPage.fields.title}` : 'No page selected'}
          </span>
          <span>
            {components.length} component{components.length !== 1 ? 's' : ''} on page
          </span>
        </div>
      </div>
    </div>
  );
}
