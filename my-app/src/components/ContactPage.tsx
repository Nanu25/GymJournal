import React, { useState } from "react";
import AuthLayout from "./AuthLayout";
import { Mail, ArrowRight, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

interface ContactPageProps {
    onNavigateToLogin?: () => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ onNavigateToLogin }) => {
    const [copied, setCopied] = useState(false);
    const email = "alexandrugrancea25@gmail.com";

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(email);
        setCopied(true);
        toast.success("Email copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AuthLayout
            title="Contact Support"
            subtitle="I'm here to help"
            maxWidth="max-w-3xl"
            showSupportLink={false}
        >
            <div className="flex flex-col items-center justify-center py-6 sm:py-10 space-y-8 sm:space-y-10">
                <div className="relative group">
                    <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition duration-500"></div>
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-[#0f172a] rounded-full flex items-center justify-center border border-blue-500/20 shadow-2xl shadow-blue-500/10">
                        <Mail className="w-10 h-10 sm:w-14 sm:h-14 text-blue-400" />
                    </div>
                </div>

                <div className="text-center space-y-3 sm:space-y-4 max-w-md px-4">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Get in touch</h3>
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                        I am here to help. If you have any issues with your account, including <strong>password resets</strong>, please email me directly.
                    </p>
                </div>

                <div className="w-full max-w-sm px-4 sm:px-0">
                    <div className="group relative w-full">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-500 to-emerald-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500 animate-gradient-x"></div>
                        <div className="relative flex flex-col sm:flex-row items-center justify-between p-1 bg-[#1e293b] border border-white/10 rounded-2xl">

                            {/* Email Display (No Link) */}
                            <div className="flex-1 flex items-center justify-center sm:justify-start gap-4 px-4 py-3 sm:py-4 w-full sm:w-auto rounded-xl transition-colors">
                                <div className="hidden sm:flex w-10 h-10 rounded-full bg-blue-500/10 items-center justify-center border border-blue-500/20">
                                    <Mail className="w-5 h-5 text-blue-400" />
                                </div>
                                <div className="flex flex-col text-center sm:text-left">
                                    <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider font-bold mb-0.5">Email Me At</span>
                                    <span className="text-sm sm:text-base font-bold text-white break-all sm:break-normal select-all">{email}</span>
                                </div>
                            </div>

                            {/* Divider for mobile */}
                            <div className="w-full h-px bg-white/5 sm:hidden my-1"></div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1 p-1 w-full sm:w-auto justify-center sm:justify-end">
                                <button
                                    onClick={handleCopy}
                                    className="p-3 sm:p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all active:scale-95 flex items-center gap-2 sm:gap-0 w-full sm:w-auto justify-center"
                                    title="Copy email"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-5 h-5 text-emerald-500" />
                                            <span className="sm:hidden text-sm font-medium text-emerald-500">Copied</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-5 h-5" />
                                            <span className="sm:hidden text-sm font-medium">Copy Email</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {onNavigateToLogin && (
                    <button
                        onClick={onNavigateToLogin}
                        className="text-sm text-slate-500 hover:text-white transition-colors py-2 px-4 rounded-lg hover:bg-white/5"
                    >
                        Back to Login
                    </button>
                )}
            </div>
        </AuthLayout>
    );
};

export default ContactPage;
