"use client";

import { cn } from "@/lib/cn";

export function LoadingOverlay({
    isVisible,
    message = "Loading..."
}: {
    isVisible: boolean;
    message?: string;
}) {
    if (!isVisible) return null;

    return (
        <div
            role="alert"
            aria-busy="true"
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/70 backdrop-blur-md transition-opacity duration-300"
        >
            <div className="relative flex items-center justify-center">
                {/* Outer pulse ring */}
                <div className="absolute h-24 w-24 animate-ping rounded-full bg-blue-500/20" />

                {/* Main spinner */}
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />

                {/* Core glow */}
                <div className="absolute h-8 w-8 rounded-full bg-blue-500/10 blur-xl" />
            </div>

            <div className="mt-8 flex flex-col items-center">
                <h2 className="text-xl font-semibold tracking-tight text-white animate-pulse">
                    {message}
                </h2>
                <p className="mt-2 text-sm text-slate-400 font-medium">
                    GitHub Shoppers AI
                </p>
            </div>

            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        </div>
    );
}
