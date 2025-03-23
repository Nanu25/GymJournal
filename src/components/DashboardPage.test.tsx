import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardPage from './DashboardPage';

// Define the TrainingEntry type to match what your components use
interface TrainingEntry {
    date: string;
    exercises: {
        [key: string]: number;
    };
}

// Mock generateMockTrainings function
jest.mock('../utils/mockData', () => ({
    generateMockTrainings: () => [
        {
            date: '2025-01-10',
            exercises: {
                'Dumbbell Press': 3,
            },
        },
    ],
}), { virtual: true });

// Mock the exerciseCategories that's imported in DashboardPage
jest.mock('../data/exercises', () => ({
    exerciseCategories: [
        { name: 'Chest', exercises: ['Dumbbell Press', 'Incline Dumbbell'] },
        { name: 'Back', exercises: ['Pullup', 'Dumbbell Row'] },
    ],
}), { virtual: true });

// Mock all child components
jest.mock('./WelcomeHeader', () => {
    return function MockWelcomeHeader({ username }: { username: string }) {
        return <div>Welcome, {username}</div>;
    };
});

jest.mock('./PersonalRecordsCard', () => {
    return function MockPersonalRecordsCard({
                                                trainings,
                                                onNavigateToTrainingSelector,
                                            }: {
        trainings: TrainingEntry[];
        onNavigateToTrainingSelector: () => void;
    }) {
        return (
            <div>
                <div data-testid="trainings-list">
                    {trainings.map((training, index) => (
                        <div key={index}>
                            <span>{training.date}</span>
                            {Object.entries(training.exercises).map(([exercise, weight]) => (
                                <span key={exercise}>{`${exercise}: ${weight}`}</span>
                            ))}
                        </div>
                    ))}
                </div>
                <button onClick={onNavigateToTrainingSelector}>Add Training</button>
            </div>
        );
    };
});

jest.mock('./PRSection', () => {
    return function MockPRSection({ trainings }: { trainings: TrainingEntry[] }) {
        return <div>PRSection</div>;
    };
});

// Updated TrainingSelector mock that now accepts exerciseCategories prop
jest.mock('./TrainingSelector', () => {
    return function MockTrainingSelector({
                                             onBackToDashboard,
                                             onSaveTraining,
                                             exerciseCategories,
                                         }: {
        onBackToDashboard: () => void;
        onSaveTraining: (newTraining: TrainingEntry) => void;
        exerciseCategories: { name: string; exercises: string[] }[];
    }) {
        return (
            <div data-testid="training-selector">
                <input aria-label="Date" defaultValue="" />
                <input aria-label="Exercise Name" defaultValue="" />
                <input aria-label="Weight" defaultValue="" />
                <button
                    onClick={() => {
                        const dateInput = screen.getByLabelText('Date') as HTMLInputElement;
                        const exerciseInput = screen.getByLabelText('Exercise Name') as HTMLInputElement;
                        const weightInput = screen.getByLabelText('Weight') as HTMLInputElement;
                        onSaveTraining({
                            date: dateInput.value,
                            exercises: {
                                [exerciseInput.value]: Number(weightInput.value),
                            },
                        });
                    }}
                >
                    Save
                </button>
                <button onClick={onBackToDashboard}>Back</button>
            </div>
        );
    };
});

describe('DashboardPage', () => {
    test('adds a new training and hides the form when saving', () => {
        render(
            <DashboardPage
                onLogout={jest.fn()}
                onNavigateToMetricsSection={jest.fn()}
                weight={70}
            />
        );

        // Initial state - verify mock training is displayed
        expect(screen.getByText('2025-01-10')).toBeInTheDocument();
        expect(screen.getByText('Dumbbell Press: 3')).toBeInTheDocument();

        // Show the training form
        const addButton = screen.getByText('Add Training');
        fireEvent.click(addButton);

        // Verify form is displayed
        expect(screen.getByTestId('training-selector')).toBeInTheDocument();
        expect(screen.getByLabelText('Date')).toBeInTheDocument();

        // Fill out the form
        fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2025-03-01' } });
        fireEvent.change(screen.getByLabelText('Exercise Name'), { target: { value: 'Squats' } });
        fireEvent.change(screen.getByLabelText('Weight'), { target: { value: '150' } });

        // Save the training
        const saveButton = screen.getByText('Save');
        fireEvent.click(saveButton);

        // Verify results - new training should be added and form should be hidden
        expect(screen.getByText('2025-03-01')).toBeInTheDocument();
        expect(screen.getByText('Squats: 150')).toBeInTheDocument();
        expect(screen.queryByTestId('training-selector')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Date')).not.toBeInTheDocument();

        // Original training should still be there
        expect(screen.getByText('2025-01-10')).toBeInTheDocument();
        expect(screen.getByText('Dumbbell Press: 3')).toBeInTheDocument();
    });
});
