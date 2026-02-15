"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

interface InvoiceModalProps {
    open: boolean;
    purchaseId: string | null;
    onClose: () => void;
}

export function InvoiceModal({ open, purchaseId, onClose }: InvoiceModalProps) {
    const [content, setContent] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open || !purchaseId) {
            setContent(null);
            setError(null);
            return;
        }

        let cancelled = false;
        setLoading(true);
        setError(null);

        fetch(`/api/purchases/${purchaseId}/invoice`)
            .then(async (res) => {
                if (!res.ok) throw new Error("Failed to fetch invoice");
                return res.text();
            })
            .then((data) => {
                if (cancelled) return;
                setContent(data);
            })
            .catch((err) => {
                if (cancelled) return;
                setError(err.message);
            })
            .finally(() => {
                if (cancelled) return;
                setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [open, purchaseId]);

    return (
        <Modal open={open} title="Invoice" onClose={onClose} className="max-w-xl">
            <div className="p-6 border-b border-white/5 flex items-start justify-between gap-4">
                <div>
                    <div className="text-white font-black text-xl">Purchase Invoice</div>
                    <div className="text-slate-500 text-sm">Official receipt for your purchase.</div>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="text-slate-400 hover:text-white"
                    aria-label="Close"
                >
                    <Icon name="close" />
                </button>
            </div>

            <div className="p-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-500">
                        <div className="animate-spin">
                            <Icon name="sync" className="text-3xl" />
                        </div>
                        <span>Loading invoice...</span>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3 text-red-400">
                        <Icon name="error_outline" className="text-3xl" />
                        <span>{error}</span>
                        <Button variant="secondary" size="sm" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                ) : (
                    <div className="bg-black/20 rounded-xl border border-white/5 p-6 overflow-auto max-h-[60vh]">
                        <pre className="text-slate-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                            {content}
                        </pre>
                    </div>
                )}
            </div>

            <div className="p-6 border-t border-white/5 flex justify-end gap-3">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => window.open(`/api/purchases/${purchaseId}/invoice`, "_blank")}
                    leftIcon={<Icon name="download" className="text-[18px]" />}
                >
                    Download TXT
                </Button>
                <Button type="button" variant="primary" onClick={onClose}>
                    Close
                </Button>
            </div>
        </Modal>
    );
}
