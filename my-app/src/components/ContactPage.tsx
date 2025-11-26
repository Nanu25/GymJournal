import React, { useState } from "react";
import AuthLayout from "./AuthLayout";
import { Send, MessageSquare, Type, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface ContactPageProps {
    onNavigateToLogin?: () => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ onNavigateToLogin }) => {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        // Simulate API call
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSubmitted(true);
            setSubject("");
            setMessage("");
        } catch (err) {
            setError("Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <AuthLayout
                title="Message Sent"
                subtitle="We'll get back to you as soon as possible."
                maxWidth="max-w-3xl"
                showSupportLink={false}
            >
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-white">Thank You!</h3>
                        <p className="text-slate-400 max-w-xs mx-auto">
                            Your message has been received. Our support team will review it shortly.
                        </p>
                    </div>
                    <button
                        onClick={() => setSubmitted(false)}
                        className="mt-4 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all duration-200"
                    >
                        Send Another Message
                    </button>

                    {onNavigateToLogin && (
                        <button
                            onClick={onNavigateToLogin}
                            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            Back to Login
                        </button>
                    )}
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Contact Support"
            subtitle="How can we help you today?"
            maxWidth="max-w-3xl"
            showSupportLink={false}
        >
            <div className="space-y-6">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl backdrop-blur-md flex items-center gap-3 animate-fade-in-up">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Subject Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Subject</label>
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full h-12 px-4 text-base text-white bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 placeholder:text-slate-500 pl-11"
                                    placeholder="I need help with..."
                                    required
                                />
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Type className="w-5 h-5 text-slate-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Message Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Message</label>
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                            <div className="relative">
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full h-40 px-4 py-3 text-base text-white bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 placeholder:text-slate-500 pl-11 resize-none"
                                    placeholder="Describe your issue in detail..."
                                    required
                                />
                                <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none">
                                    <MessageSquare className="w-5 h-5 text-slate-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Send Button */}
                    <div className="group relative mt-4">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-500 to-emerald-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500 animate-gradient-x"></div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="relative w-full h-12 text-base font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden active:scale-[0.98]"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Send Message</span>
                                        <Send className="w-4 h-4" />
                                    </>
                                )}
                            </span>
                        </button>
                    </div>
                </form>

                {onNavigateToLogin && (
                    <div className="text-center mt-4">
                        <button
                            onClick={onNavigateToLogin}
                            className="text-sm text-slate-400 hover:text-white transition-colors"
                        >
                            Back to Login
                        </button>
                    </div>
                )}
            </div>
        </AuthLayout>
    );
};

export default ContactPage;
