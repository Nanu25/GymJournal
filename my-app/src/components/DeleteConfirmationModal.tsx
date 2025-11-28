import React from 'react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    isDeleting: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    isDeleting,
    onCancel,
    onConfirm
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a2234] p-8 rounded-2xl shadow-2xl max-w-md w-full border border-white/10">
                <h3 className="text-2xl font-bold mb-4 text-white">Confirm Delete</h3>
                <p className="mb-6 text-blue-200/70">Are you sure you want to delete this training session?</p>
                <div className="flex justify-end space-x-4">
                    <button
                        className="px-6 py-2 bg-white/5 text-white rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={onCancel}
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-6 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl border border-rose-500/20 hover:from-rose-600 hover:to-rose-700 transition-all duration-200 shadow-lg shadow-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
