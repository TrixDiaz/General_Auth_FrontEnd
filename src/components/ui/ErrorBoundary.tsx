import React from "react";

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // You can log error info here
        // console.error(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="p-4 min-h-screen flex flex-col items-center justify-center text-center text-destructive">
                    <h2 className="text-lg font-bold mb-2">Something went wrong.</h2>
                    <pre className="text-xs whitespace-pre-wrap text-left">{this.state.error?.message}</pre>
                </div>
            );
        }
        return this.props.children;
    }
} 