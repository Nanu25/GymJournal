interface ExerciseData {
    [key: string]: number;
}

interface TrainingEntry {
    date: string;
    exercises: ExerciseData;
}

class InMemoryTrainingRepository {
    private trainings: TrainingEntry[] = [];

    addTraining(training: TrainingEntry): void {
        this.trainings = [training, ...this.trainings];
    }

    deleteTraining(index: number): boolean {
        if (index >= 0 && index < this.trainings.length) {
            this.trainings.splice(index, 1);
            return true;
        }
        return false;
    }

    getAllTrainings(): TrainingEntry[] {
        return [...this.trainings];
    }
}

describe('InMemoryTrainingRepository', () => {
    let repository: InMemoryTrainingRepository;

    beforeEach(() => {
        repository = new InMemoryTrainingRepository();
    });

    test('should add trainings correctly', () => {
        // Arrange
        const training1: TrainingEntry = {
            date: '2025-03-15',
            exercises: {
                'Bench Press': 100,
                'Squat': 150,
            }
        };

        const training2: TrainingEntry = {
            date: '2025-03-18',
            exercises: {
                'Deadlift': 180,
                'Pull-ups': 0,
            }
        };

        // Act
        repository.addTraining(training1);
        repository.addTraining(training2);

        // Assert
        const allTrainings = repository.getAllTrainings();
        expect(allTrainings.length).toBe(2);
        expect(allTrainings[0]).toEqual(training2);
        expect(allTrainings[1]).toEqual(training1);
    });

    test('should delete a training correctly', () => {
        // Arrange
        const training1: TrainingEntry = {
            date: '2025-03-15',
            exercises: { 'Bench Press': 100 }
        };

        const training2: TrainingEntry = {
            date: '2025-03-18',
            exercises: { 'Deadlift': 180 }
        };

        repository.addTraining(training1);
        repository.addTraining(training2);

        // Act
        const result = repository.deleteTraining(0);

        // Assert
        expect(result).toBe(true);
        const remainingTrainings = repository.getAllTrainings();
        expect(remainingTrainings.length).toBe(1);
        expect(remainingTrainings[0]).toEqual(training1);
    });

    test('should handle deleting non-existent training', () => {
        // Arrange
        const training: TrainingEntry = {
            date: '2025-03-15',
            exercises: { 'Bench Press': 100 }
        };

        repository.addTraining(training);

        // Act & Assert
        expect(repository.deleteTraining(1)).toBe(false);
        expect(repository.deleteTraining(-1)).toBe(false);

        const remainingTrainings = repository.getAllTrainings();
        expect(remainingTrainings.length).toBe(1);
    });
});