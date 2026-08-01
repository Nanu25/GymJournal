import React from "react";
import PRSection from "./PRSection";

const PRSectionPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#0f172a] text-white selection:bg-blue-500/30 overflow-x-hidden">
            <header className="w-full bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50 supports-[backdrop-filter]:bg-[#0f172a]/80">
                <div className="container mx-auto px-4 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400 mb-1">Analytics</p>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-200">
                            Personal Records
                        </h1>
                    </div>
                    {/* Back button removed as it is replaced by Global Navbar */}
                </div>
            </header>
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <section className="w-full max-w-7xl mx-auto pb-20">
                    <PRSection />
                </section>
            </main>
        </div>
    );
};

export default PRSectionPage;
