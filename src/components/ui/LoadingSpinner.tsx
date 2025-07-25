import { LoaderCircle } from "lucide-react";

export function LoadingSpinner({ className = "text-white" }) {
    return (
      <div className={`flex items-center justify-center gap-2 ${className}`}>
        <LoaderCircle className="h-5 w-5 animate-spin" />
        <span className="animate-pulse">Loading...</span>
      </div>
    );
  }