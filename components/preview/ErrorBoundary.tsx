'use client';
import React, { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  isDraft?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundaryImpl extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[PreviewErrorBoundary] Caught error:', error);
    console.error('[PreviewErrorBoundary] Error info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-red-200 p-6 max-w-md w-full shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">❌</span>
              <h1 className="text-lg font-semibold text-red-900">
                Preview Error
              </h1>
            </div>

            <p className="text-sm text-red-700 mb-4">
              An error occurred while rendering the preview. Please check the
              console for details.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-gray-50 rounded p-3 mb-4">
                <p className="text-xs font-mono text-gray-700 break-words">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-sm"
            >
              Reload Page
            </button>

            {this.props.isDraft && (
              <p className="text-xs text-gray-600 mt-3 text-center">
                This is a draft preview. Save your changes and try again.
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const ErrorBoundary = ErrorBoundaryImpl;
