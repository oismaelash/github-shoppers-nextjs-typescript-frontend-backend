"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";

interface LoadingContextType {
    setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function useLoading() {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }
    return context;
}

export function LoadingProvider({ children }: { children: ReactNode }) {
    const [activeRequests, setActiveRequests] = useState(0);

    useEffect(() => {
        // Basic counter-based interception for native fetch
        const originalFetch = window.fetch;

        window.fetch = async (...args) => {
            setActiveRequests((prev) => prev + 1);
            try {
                return await originalFetch(...args);
            } finally {
                setActiveRequests((prev) => Math.max(0, prev - 1));
            }
        };

        return () => {
            window.fetch = originalFetch;
        };
    }, []);

    return (
        <LoadingContext.Provider value={{ setIsLoading: (loading) => setActiveRequests(l => loading ? l + 1 : Math.max(0, l - 1)) }}>
            <LoadingOverlay isVisible={activeRequests > 0} />
            {children}
        </LoadingContext.Provider>
    );
}
