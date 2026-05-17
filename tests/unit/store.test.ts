
import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import {
  createDefaultComponent,
  generateId,
  addComponent,
  removeComponent,
  updateComponent,
  selectComponent,
  undo,
  redo,
  markAsSaved,
  markAsSaving,
  clearComponents,
  setComponents,
  setCurrentPage,
  store,
} from '@/lib/store';
import type { BuilderComponent, PageModel } from '@/lib/schema';

describe('Editor Store', () => {
  describe('createDefaultComponent', () => {
    it('should create a button component with default props', () => {
      const button = createDefaultComponent('button');
      expect(button).toBeDefined();
      expect(button?.type).toBe('button');
      expect(button?.props.label).toBe('Click me');
      expect(button?.props.variant).toBe('primary');
    });

    it('should create a text component', () => {
      const text = createDefaultComponent('text');
      expect(text).toBeDefined();
      expect(text?.type).toBe('text');
      expect(text?.props.content).toBe('Add your text here');
    });

    it('should create a card component', () => {
      const card = createDefaultComponent('card');
      expect(card).toBeDefined();
      expect(card?.type).toBe('card');
      expect(card?.props.title).toBe('Card Title');
    });

    it('should create a section component with children array', () => {
      const section = createDefaultComponent('section');
      expect(section).toBeDefined();
      expect(section?.type).toBe('section');
      expect(Array.isArray(section?.children)).toBe(true);
    });

    it('should return null for unknown component type', () => {
      const unknown = createDefaultComponent('unknown-type');
      expect(unknown).toBeNull();
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
      expect(id1.length).toBeGreaterThan(0);
      expect(id2.length).toBeGreaterThan(0);
    });
  });

  describe('Component Operations', () => {
    beforeEach(() => {
      store.dispatch(clearComponents());
    });

    it('should add a component to the canvas', () => {
      const button = createDefaultComponent('button') as BuilderComponent;
      store.dispatch(addComponent(button));
      
      const state = store.getState().editor;
      expect(state.components).toHaveLength(1);
      expect(state.components[0].type).toBe('button');
      expect(state.isDirty).toBe(true);
    });

    it('should remove a component', () => {
      const button = createDefaultComponent('button') as BuilderComponent;
      store.dispatch(addComponent(button));
      store.dispatch(removeComponent(button.id));
      
      const state = store.getState().editor;
      expect(state.components).toHaveLength(0);
    });

    it('should update a component property', () => {
      const button = createDefaultComponent('button') as BuilderComponent;
      store.dispatch(addComponent(button));
      
      const updated: BuilderComponent = {
        ...button,
        props: { ...button.props, label: 'Updated Label' },
      };
      store.dispatch(updateComponent(updated));
      
      const state = store.getState().editor;
      expect(state.components[0].props.label).toBe('Updated Label');
    });
  });

  describe('Selection', () => {
    beforeEach(() => {
      store.dispatch(clearComponents());
    });

    it('should select a component', () => {
      const button = createDefaultComponent('button') as BuilderComponent;
      store.dispatch(addComponent(button));
      store.dispatch(selectComponent(button.id));
      
      const state = store.getState().editor;
      expect(state.selectedComponentId).toBe(button.id);
    });

    it('should deselect component with null', () => {
      const button = createDefaultComponent('button') as BuilderComponent;
      store.dispatch(addComponent(button));
      store.dispatch(selectComponent(button.id));
      store.dispatch(selectComponent(null));
      
      const state = store.getState().editor;
      expect(state.selectedComponentId).toBeNull();
    });

    it('should retrieve selected component', () => {
      const button = createDefaultComponent('button') as BuilderComponent;
      store.dispatch(addComponent(button));
      store.dispatch(selectComponent(button.id));
      
      const state = store.getState().editor;
      const selected = state.components.find(c => c.id === state.selectedComponentId);
      expect(selected?.type).toBe('button');
    });
  });

  describe('History & Undo/Redo', () => {
    beforeEach(() => {
      store.dispatch(clearComponents());
    });

    it('should not allow undo when at initial state', () => {
      const state = store.getState().editor;
      expect(state.historyIndex).toBe(0);
    });

    it('should allow undo after component addition', () => {
      const button = createDefaultComponent('button') as BuilderComponent;
      store.dispatch(addComponent(button));
      
      let state = store.getState().editor;
      const initialHistoryIndex = state.historyIndex;
      expect(initialHistoryIndex).toBeGreaterThan(0);
      expect(state.history.length).toBeGreaterThan(1);
      
      store.dispatch(undo());
      state = store.getState().editor;
      expect(state.historyIndex).toBeLessThan(initialHistoryIndex);
    });

    it('should undo component addition', () => {
      const button = createDefaultComponent('button') as BuilderComponent;
      store.dispatch(addComponent(button));
      
      let state = store.getState().editor;
      expect(state.components).toHaveLength(1);
      
      store.dispatch(undo());
      state = store.getState().editor;
      expect(state.components).toHaveLength(0);
    });

    it('should redo after undo', () => {
      const button = createDefaultComponent('button') as BuilderComponent;
      store.dispatch(addComponent(button));
      
      let state = store.getState().editor;
      const afterAddLength = state.components.length;
      
      store.dispatch(undo());
      state = store.getState().editor;
      expect(state.components).toHaveLength(0);
      
      store.dispatch(redo());
      state = store.getState().editor;
      expect(state.components).toHaveLength(afterAddLength);
    });

    it('should track history across multiple operations', () => {
      const button = createDefaultComponent('button') as BuilderComponent;
      store.dispatch(addComponent(button));
      
      const card = createDefaultComponent('card') as BuilderComponent;
      store.dispatch(addComponent(card));
      
      const state = store.getState().editor;
      expect(state.history.length).toBeGreaterThan(2);
      expect(state.components).toHaveLength(2);
    });
  });

  describe('Dirty State', () => {
    beforeEach(() => {
      store.dispatch(clearComponents());
    });

    it('should mark changes as unsaved', () => {
      const button = createDefaultComponent('button') as BuilderComponent;
      store.dispatch(addComponent(button));
      
      const state = store.getState().editor;
      expect(state.isDirty).toBe(true);
    });

    it('should mark as saved', () => {
      const button = createDefaultComponent('button') as BuilderComponent;
      store.dispatch(addComponent(button));
      store.dispatch(markAsSaved());
      
      const state = store.getState().editor;
      expect(state.isDirty).toBe(false);
    });

    it('should auto-mark as dirty on component add', () => {
      const button = createDefaultComponent('button') as BuilderComponent;
      store.dispatch(addComponent(button));
      
      let state = store.getState().editor;
      expect(state.isDirty).toBe(true);
      
      store.dispatch(markAsSaved());
      state = store.getState().editor;
      expect(state.isDirty).toBe(false);
      
      const card = createDefaultComponent('card') as BuilderComponent;
      store.dispatch(addComponent(card));
      state = store.getState().editor;
      expect(state.isDirty).toBe(true);
    });
  });

  describe('Page Management', () => {
    it('should set current page', () => {
      const mockPage: PageModel = {
        sys: {
          id: 'page-1',
          type: 'Entry',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        fields: {
          title: 'Test Page',
          slug: 'test-page',
          components: [],
          published: false,
        },
      };
      
      store.dispatch(setCurrentPage(mockPage));
      const state = store.getState().editor;
      expect(state.currentPage?.fields.title).toBe('Test Page');
      expect(state.isDirty).toBe(false);
    });

    it('should create new empty page', () => {
      store.dispatch(clearComponents());
      const state = store.getState().editor;
      expect(state.components).toHaveLength(0);
      expect(state.selectedComponentId).toBeNull();
    });
  });
});
