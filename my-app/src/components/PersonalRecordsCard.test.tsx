// import React from 'react';
// import { render, screen, fireEvent, within } from '@testing-library/react';
// import PersonalRecordsCard from './PersonalRecordsCard';
// import '@testing-library/jest-dom';

// interface TrainingEntry {
//     date: string;
//     exercises: { [key: string]: number };
// }

// describe('PersonalRecordsCard', () => {
//     const initialTrainings: TrainingEntry[] = [
//         {
//             date: '2025-01-01',
//             exercises: {
//                 'Bench Press': 100,
//                 'Squat': 150,
//             },
//         },
//         {
//             date: '2025-01-02',
//             exercises: {
//                 'Deadlift': 200,
//                 'Shoulder Press': 80,
//             },
//         },
//         {
//             date: '2025-01-03',
//             exercises: {
//                 'Pull-up': 0,
//                 'Leg Press': 250,
//             },
//         },
//     ];

//     const mockSetTrainings = jest.fn();
//     const mockNavigateToMetricsSection = jest.fn();
//     const mockNavigateToTrainingSelector = jest.fn();
//     const mockUpdateTraining = jest.fn();

//     beforeEach(() => {
//         jest.clearAllMocks();
//     });

//     test('deletes a training and hides the confirmation dialog', () => {
//         render(
//             <PersonalRecordsCard
//                 trainings={initialTrainings}
//                 setTrainings={mockSetTrainings}
//                 onNavigateToMetricsSection={mockNavigateToMetricsSection}
//                 onNavigateToTrainingSelector={mockNavigateToTrainingSelector}
//                 weight={75}
//                 onUpdateTraining={mockUpdateTraining}
//             />
//         );

//         // Click the first "Delete" button to open the confirmation dialog
//         const deleteButtons = screen.getAllByText('Delete');
//         fireEvent.click(deleteButtons[0]);

//         // Find the confirmation dialog container using its unique text
//         const dialogText = screen.getByText('Are you sure you want to delete this training session?');
//         expect(dialogText).toBeInTheDocument();
        
//         const dialogContainer = dialogText.parentElement;
//         expect(dialogContainer).not.toBeNull();
        
//         if (dialogContainer) {
//             // Find the "Delete" button within the dialog container
//             const confirmDeleteButton = within(dialogContainer).getByText('Delete');
            
//             // Click the "Delete" button in the confirmation dialog
//             fireEvent.click(confirmDeleteButton);
            
//             // Check that setTrainings was called with the correct updated array
//             expect(mockSetTrainings).toHaveBeenCalledWith(
//                 expect.arrayContaining([
//                     initialTrainings[1],
//                     initialTrainings[2]
//                 ])
//             );
//         }

//         // Check that the confirmation dialog is closed
//         expect(screen.queryByText('Are you sure you want to delete this training session?')).not.toBeInTheDocument();
//     });

//     test('cancels deletion when "Cancel" is clicked', () => {
//         render(
//             <PersonalRecordsCard
//                 trainings={initialTrainings}
//                 setTrainings={mockSetTrainings}
//                 onNavigateToMetricsSection={mockNavigateToMetricsSection}
//                 onNavigateToTrainingSelector={mockNavigateToTrainingSelector}
//                 weight={75}
//                 onUpdateTraining={mockUpdateTraining}
//             />
//         );

//         // Click the first "Delete" button to open the confirmation dialog
//         const deleteButtons = screen.getAllByText('Delete');
//         fireEvent.click(deleteButtons[0]);

//         // Find the confirmation dialog container
//         const dialogText = screen.getByText('Are you sure you want to delete this training session?');
//         expect(dialogText).toBeInTheDocument();
        
//         const dialogContainer = dialogText.parentElement;
//         expect(dialogContainer).not.toBeNull();
        
//         if (dialogContainer) {
//             // Find and click the "Cancel" button within the dialog container
//             const cancelButton = within(dialogContainer).getByText('Cancel');
//             fireEvent.click(cancelButton);
//         }

//         // Verify that setTrainings was not called
//         expect(mockSetTrainings).not.toHaveBeenCalled();

//         // Check that the confirmation dialog is closed
//         expect(screen.queryByText('Are you sure you want to delete this training session?')).not.toBeInTheDocument();
//     });
// });