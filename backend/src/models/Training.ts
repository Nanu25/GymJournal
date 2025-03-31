import mongoose from 'mongoose';
interface ITraining {
    date: string;
    exercises: { [key: string]: number };
}
const TrainingSchema = new mongoose.Schema<ITraining>({
    date: { type: String, required: true },
    exercises: { type: Map, of: Number, required: true }
});
export const Training = mongoose.model<ITraining>('Training', TrainingSchema);