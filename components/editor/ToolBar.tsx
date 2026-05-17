import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { undo, redo } from '@/lib/store';
import { Undo2, Redo2, Save, Eye, Lock } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import type { RootState, AppDispatch } from '@/lib/store';
import type { UserRole } from '@/lib/auth/roles';

interface ToolBarProps {
  onSave?: () => void;
  onPublish?: () => void;
  onPreview?: () => void;
  isSaving?: boolean;
  userRole?: UserRole;
}

const ToolBar: React.FC<ToolBarProps> = ({
  onSave,
  onPublish,
  onPreview,
  isSaving = false,
  userRole = 'publisher',
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const historyIndex = useSelector((state: RootState) => state.editor.historyIndex);
  const history = useSelector((state: RootState) => state.editor.history);
  const isDirty = useSelector((state: RootState) => state.editor.isDirty);
  
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;
  const canPublish = userRole === 'publisher';

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
      {/* Left section: History controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => dispatch(undo())}
          disabled={!canUndo}
          className={cn(
            'p-2 rounded-md transition-colors',
            canUndo
              ? 'hover:bg-gray-100 cursor-pointer'
              : 'opacity-50 cursor-not-allowed'
          )}
          aria-label="Undo"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={18} className="text-gray-600" />
        </button>

        <button
          onClick={() => dispatch(redo())}
          disabled={!canRedo}
          className={cn(
            'p-2 rounded-md transition-colors',
            canRedo
              ? 'hover:bg-gray-100 cursor-pointer'
              : 'opacity-50 cursor-not-allowed'
          )}
          aria-label="Redo"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={18} className="text-gray-600" />
        </button>

        <div className="w-px h-6 bg-gray-200" />
      </div>

      <div className="text-sm text-gray-600">
        {isDirty && (
          <span className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-orange-500 rounded-full" />
            Unsaved changes
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={onPreview}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Eye size={16} />
          Preview
        </Button>

        <Button
          onClick={onSave}
          disabled={isSaving || !isDirty}
          size="sm"
          className="gap-2"
        >
          <Save size={16} />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>

        {!canPublish ? (
          <Button
            disabled
            variant="ghost"
            size="sm"
            className="gap-2"
            title={`${userRole} role cannot publish`}
          >
            <Lock size={16} />
            Publish
          </Button>
        ) : (
          <Button
            onClick={onPublish}
            variant="default"
            size="sm"
          >
            Publish
          </Button>
        )}
      </div>
    </div>
  );
};

ToolBar.displayName = 'ToolBar';

export { ToolBar };
export type { ToolBarProps };
