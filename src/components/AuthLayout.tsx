import React from "react";

export default function AuthLayout({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="border rounded-xl shadow-md p-10 w-full max-w-md flex flex-col items-center">
                <div className="flex items-center mb-6">
                    <img src="vite.svg" alt="Vite" />
                    <span className="ml-2 text-2xl font-semibold">Fastlink</span>
                </div>
                <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
                {children}
            </div>
        </div>
    );
}
