import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { TrainingEntry } from '../services/trainingService';
import { useExercises } from '../hooks/useTrainings';


interface Exercise {
    name: string;
    weight: number;
}

interface UpdateTrainingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (date: string, exercises: Record<string, number>) => Promise<void>;
    initialData: TrainingEntry | null;
}

const UpdateTrainingModal: React.FC<UpdateTrainingModalProps> = ({ isOpen, onClose, onUpdate, initialData }) => {
    const [formData, setFormData] = useState<{ date: string; exercises: Exercise[] }>({
        date: '',
        exercises: []
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Use TanStack Query for exercises
    const { data: exerciseCategories = [] } = useExercises();

    const exerciseOptions = useMemo(() => {
        return exerciseCategories.flatMap((group: any) => group.exercises);
    }, [exerciseCategories]);

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                date: initialData.date,
                exercises: Object.entries(initialData.exercises).map(([name, weight]) => ({ name, weight }))
            });
        }
    }, [isOpen, initialData]);

    const handleExerciseNameChange = (index: number, value: string) => {
        const newExercises = [...formData.exercises];
        newExercises[index].name = value;
        setFormData({ ...formData, exercises: newExercises });
    };

    const handleExerciseWeightChange = (index: number, value: string) => {
        const newExercises = [...formData.exercises];
        newExercises[index].weight = Number(value);
        setFormData({ ...formData, exercises: newExercises });
    };

    const addExerciseField = () => {
        setFormData({
            ...formData,
            exercises: [...formData.exercises, { name: '', weight: 0 }]
        });
    };

    const removeExerciseField = (index: number) => {
        const newExercises = formData.exercises.filter((_, i) => i !== index);
        setFormData({ ...formData, exercises: newExercises });
    };

    const handleSubmit = async () => {
        const exercisesObject: Record<string, number> = {};
        formData.exercises.forEach((exercise) => {
            if (exercise.name.trim()) {
                exercisesObject[exercise.name.trim()] = exercise.weight;
            }
        });

        setIsSubmitting(true);
        try {
            await onUpdate(formData.date, exercisesObject);
            onClose();
        } catch (error) {
            console.error('Error updating training:', error);
            toast.error(`Failed to update training: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a2234] p-4 md:p-8 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-white/10 custom-scrollbar">
                <h3 className="text-2xl font-bold mb-6 text-white">Update Training Session</h3>
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-blue-200">Date:</label>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-4 py-2 bg-[#0f172a] border border-blue-500/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-blue-200">Exercises:</label>

                    {/* Global Datalist for Autocomplete */}
                    <datalist id="exercise-options">
                        {exerciseOptions.map((option: string) => (
                            <option key={option} value={option} />
                        ))}
                    </datalist>

                    <div className="space-y-3">
                        {formData.exercises.map((exercise, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                                <div className="relative flex-grow">
                                    <input
                                        list="exercise-options"
                                        value={exercise.name}
                                        onChange={(e) => handleExerciseNameChange(idx, e.target.value)}
                                        placeholder="Search or type exercise..."
                                        className="w-full px-3 sm:px-4 py-2 bg-[#0f172a] border border-blue-500/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 text-sm sm:text-base"
                                    />
                                </div>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="kg"
                                    value={exercise.weight}
                                    onChange={(e) => handleExerciseWeightChange(idx, e.target.value)}
                                    className="w-16 sm:w-24 px-2 sm:px-4 py-2 bg-[#0f172a] border border-blue-500/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 text-sm sm:text-base text-center"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeExerciseField(idx)}
                                    className="p-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl hover:bg-rose-500/20 transition-all duration-200 flex-shrink-0"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={addExerciseField}
                        className="mt-4 px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 transition-all duration-200 w-full text-sm sm:text-base font-medium"
                    >
                        + Add Exercise
                    </button>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        className="px-6 py-2 bg-white/5 text-white rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl border border-emerald-500/20 hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
};

export default UpdateTrainingModal;
