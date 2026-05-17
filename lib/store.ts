import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { BuilderComponent, PageModel } from './schema';

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function createDefaultComponent(type: string): BuilderComponent | null {
  const id = generateId();
  const now = new Date().toISOString();

  const metadata = {
    createdAt: now,
    updatedAt: now,
  };

  switch (type) {
    case 'button':
      return {
        id,
        type: 'button' as const,
        props: {
          label: 'Click me',
          variant: 'primary',
          size: 'md',
        },
        layout: {
          margin: { top: 0, right: 0, bottom: 16, left: 0 },
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
          alignment: 'left',
        },
        metadata,
      } as any;

    case 'card':
      return {
        id,
        type: 'card' as const,
        props: {
          title: 'Card Title',
          description: 'Add card description here',
        },
        layout: {
          margin: { top: 0, right: 0, bottom: 16, left: 0 },
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
          alignment: 'left',
        },
        metadata,
      } as any;

    case 'section':
      return {
        id,
        type: 'section' as const,
        props: {
          title: 'Section',
          layout: 'single',
          padding: 'md',
        },
        layout: {
          margin: { top: 0, right: 0, bottom: 16, left: 0 },
          padding: { top: 16, right: 16, bottom: 16, left: 16 },
          alignment: 'full',
        },
        children: [],
        metadata,
      } as any;

    case 'hero':
      return {
        id,
        type: 'hero' as const,
        props: {
          headline: 'Welcome to our page',
          description: 'This is a hero section',
          height: 'lg',
        },
        layout: {
          margin: { top: 0, right: 0, bottom: 16, left: 0 },
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
          alignment: 'full',
        },
        metadata,
      } as any;

    case 'grid':
      return {
        id,
        type: 'grid' as const,
        props: {
          columns: 3,
          gap: 'md',
        },
        layout: {
          margin: { top: 0, right: 0, bottom: 16, left: 0 },
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
          alignment: 'full',
        },
        children: [],
        metadata,
      } as any;

    case 'text':
      return {
        id,
        type: 'text' as const,
        props: {
          content: 'Add your text here',
          variant: 'p',
          textAlign: 'left',
        },
        layout: {
          margin: { top: 0, right: 0, bottom: 16, left: 0 },
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
          alignment: 'left',
        },
        metadata,
      } as any;

    case 'container':
      return {
        id,
        type: 'container' as const,
        props: {},
        children: [],
        metadata,
      } as any;

    default:
      return null;
  }
}

interface EditorState {
  components: BuilderComponent[];
  selectedComponentId: string | null;
  currentPage: PageModel | null;
  isDirty: boolean;
  isSaving: boolean;
  history: BuilderComponent[][];
  historyIndex: number;
}


const initialState: EditorState = {
  components: [],
  selectedComponentId: null,
  currentPage: null,
  isDirty: false,
  isSaving: false,
  history: [[]],
  historyIndex: 0,
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
  
    setCurrentPage: (state, action: PayloadAction<PageModel>) => {
      state.currentPage = action.payload;
      const loadedComponents = action.payload.fields?.components || [];
      // Deep copy to ensure Redux state isolation and preserve all layout metadata
      state.components = loadedComponents.map(component => ({
        ...component,
        layout: component.layout ? { ...component.layout } : undefined,
        props: component.props ? { ...component.props } : undefined,
        children: component.children ? [...component.children] : undefined,
      }));
      state.isDirty = false;
      state.history = [state.components];
      state.historyIndex = 0;
      state.selectedComponentId = null;
      console.log('[v0] Page hydrated with', state.components.length, 'components');
    },

  
    addComponent: (state, action: PayloadAction<BuilderComponent>) => {
      state.components.push(action.payload);
      state.isDirty = true;
      state.history = state.history.slice(0, state.historyIndex + 1);
      state.history.push([...state.components]);
      state.historyIndex++;
    },

 
    updateComponent: (state, action: PayloadAction<BuilderComponent>) => {
      const index = state.components.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.components[index] = action.payload;
        state.isDirty = true;
        state.history = state.history.slice(0, state.historyIndex + 1);
        state.history.push([...state.components]);
        state.historyIndex++;
      }
    },

  
    removeComponent: (state, action: PayloadAction<string>) => {
      state.components = state.components.filter((c) => c.id !== action.payload);
      if (state.selectedComponentId === action.payload) {
        state.selectedComponentId = null;
      }
      state.isDirty = true;
      state.history = state.history.slice(0, state.historyIndex + 1);
      state.history.push([...state.components]);
      state.historyIndex++;
    },

  
    selectComponent: (state, action: PayloadAction<string | null>) => {
      state.selectedComponentId = action.payload;
    },

 
    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex--;
        state.components = [...state.history[state.historyIndex]];
        state.selectedComponentId = null;
      }
    },


    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        state.components = [...state.history[state.historyIndex]];
        state.selectedComponentId = null;
      }
    },


    markAsSaved: (state) => {
      state.isDirty = false;
      state.isSaving = false;
    },

    markAsSaving: (state) => {
      state.isSaving = true;
    },

    clearComponents: (state) => {
      state.components = [];
      state.selectedComponentId = null;
      state.isDirty = true;
      state.history = [[]];
      state.historyIndex = 0;
    },

    setComponents: (state, action: PayloadAction<BuilderComponent[]>) => {
      state.components = action.payload;
      state.isDirty = true;
      state.history = state.history.slice(0, state.historyIndex + 1);
      state.history.push([...state.components]);
      state.historyIndex++;
    },


    clearCurrentPage: (state) => {
      state.currentPage = null;
      state.components = [];
      state.selectedComponentId = null;
      state.isDirty = false;
      state.isSaving = false;
      state.history = [[]];
      state.historyIndex = 0;
    },
  },
});


export const {
  setCurrentPage,
  addComponent,
  updateComponent,
  removeComponent,
  selectComponent,
  undo,
  redo,
  markAsSaved,
  markAsSaving,
  clearComponents,
  setComponents,
  clearCurrentPage,
} = editorSlice.actions;


export const store = configureStore({
  reducer: {
    editor: editorSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


export function useEditorStore() {
  return {
    getState: () => store.getState().editor,
  };
}
