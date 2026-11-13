import React from 'react'

type Props = { children: React.ReactNode; fallback?: React.ReactNode }
type State = { hasError: boolean; message?: string }

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false }
  static getDerivedStateFromError(error: any): State {
    return { hasError: true, message: error?.message || String(error) }
  }
  componentDidCatch(error: any, info: any) {
    console.error('UI error boundary caught:', error, info)
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
          <h2 className="font-semibold text-lg mb-1">Something went wrong</h2>
          <p className="text-sm">{this.state.message}</p>
          <p className="text-sm mt-2">Try refreshing the page. If it persists, check the browser console for details.</p>
        </div>
      )
    }
    return this.props.children
  }
}