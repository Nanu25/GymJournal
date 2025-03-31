import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PersonalRecordsCard from './PersonalRecordsCard';
import '@testing-library/jest-dom';

describe('PersonalRecordsCard Update', () => {
    const initialTrainings = [
        {
            date: '2025-01-01',
            exercises: {
                'Bench Press': 100,
                'Squat': 150,
            },
        }
    ];

    test('opens update form and updates training', () => {
        const mockSetTrainings = jest.fn();
        render(
            <PersonalRecordsCard
                trainings={initialTrainings}
                setTrainings={mockSetTrainings}
                weight={75}
                onNavigateToMetricsSection={() => {}}
                onNavigateToTrainingSelector={() => {}}
            />
        );
        const updateButtons = screen.getAllByText('Update');
        fireEvent.click(updateButtons[0]);
        expect(screen.getByText('Update Training Session')).toBeInTheDocument();

        const dateInput = screen.getByDisplayValue('2025-01-01');
        fireEvent.change(dateInput, { target: { value: '2025-02-01' } });

        const weightInput = screen.getByDisplayValue('100');
        fireEvent.change(weightInput, { target: { value: '110' } });

        const saveButton = screen.getByText('Save Changes');
        fireEvent.click(saveButton);

        expect(mockSetTrainings).toHaveBeenCalledWith([
            {
                date: '2025-02-01',
                exercises: {
                    'Bench Press': 110,
                    'Squat': 150,
                },
            }
        ]);
    });

    test('updates multiple exercises', () => {
        const mockSetTrainings = jest.fn();
        render(
            <PersonalRecordsCard
                trainings={initialTrainings}
                setTrainings={mockSetTrainings}
                weight={75}
                onNavigateToMetricsSection={() => {}}
                onNavigateToTrainingSelector={() => {}}
            />
        );
        fireEvent.click(screen.getAllByText('Update')[0]);

        const benchPressInput = screen.getByDisplayValue('100');
        fireEvent.change(benchPressInput, { target: { value: '110' } });

        const squatInput = screen.getByDisplayValue('150');
        fireEvent.change(squatInput, { target: { value: '160' } });

        fireEvent.click(screen.getByText('Save Changes'));

        expect(mockSetTrainings).toHaveBeenCalledWith([
            {
                date: '2025-01-01',
                exercises: {
                    'Bench Press': 110,
                    'Squat': 160,
                },
            }
        ]);
    });

    test('canceling update does not change data', () => {
        const mockSetTrainings = jest.fn();
        render(
            <PersonalRecordsCard
                trainings={initialTrainings}
                setTrainings={mockSetTrainings}
                weight={75}
                onNavigateToMetricsSection={() => {}}
                onNavigateToTrainingSelector={() => {}}
            />
        );
        fireEvent.click(screen.getAllByText('Update')[0]);
        fireEvent.click(screen.getByText('Cancel'));

        expect(mockSetTrainings).not.toHaveBeenCalled();
    });

    test('updates only one exercise without affecting others', () => {
        const mockSetTrainings = jest.fn();
        render(
            <PersonalRecordsCard
                trainings={initialTrainings}
                setTrainings={mockSetTrainings}
                weight={75}
                onNavigateToMetricsSection={() => {}}
                onNavigateToTrainingSelector={() => {}}
            />
        );
        fireEvent.click(screen.getAllByText('Update')[0]);

        const benchPressInput = screen.getByDisplayValue('100');
        fireEvent.change(benchPressInput, { target: { value: '120' } });

        fireEvent.click(screen.getByText('Save Changes'));

        expect(mockSetTrainings).toHaveBeenCalledWith([
            {
                date: '2025-01-01',
                exercises: {
                    'Bench Press': 120,
                    'Squat': 150,
                },
            }
        ]);
    });

    test('handles empty exercise value gracefully', () => {
        const mockSetTrainings = jest.fn();
        render(
            <PersonalRecordsCard
                trainings={initialTrainings}
                setTrainings={mockSetTrainings}
                weight={75}
                onNavigateToMetricsSection={() => {}}
                onNavigateToTrainingSelector={() => {}}
            />
        );
        fireEvent.click(screen.getAllByText('Update')[0]);

        const benchPressInput = screen.getByDisplayValue('100');
        fireEvent.change(benchPressInput, { target: { value: '' } });

        fireEvent.click(screen.getByText('Save Changes'));

        expect(mockSetTrainings).toHaveBeenCalledWith([
            {
                date: '2025-01-01',
                exercises: {
                    'Bench Press': 0,
                    'Squat': 150,
                },
            }
        ]);
    });
});
