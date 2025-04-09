import React, { useState, useEffect } from 'react';
import { TrainingEntry } from '../types/TrainingEntry';
import { offlineStorage } from '../services/OfflineStorageService';
import { useNetworkStatus } from '../services/NetworkStatusService';

interface OfflineSessionPageProps {
  onBackToDashboard: () => void;
}

const OfflineSessionPage: React.FC<OfflineSessionPageProps> = ({ onBackToDashboard }) => {
  const [trainings, setTrainings] = useState<TrainingEntry[]>([]);
  const [pendingOperations, setPendingOperations] = useState<{ type: string; data: TrainingEntry }[]>([]);
  const { isOnline, isServerAvailable } = useNetworkStatus();

  useEffect(() => {
    // Load offline data when component mounts
    const offlineTrainings = offlineStorage.getTrainings();
    setTrainings(offlineTrainings);

    // Load pending operations
    const operations = offlineStorage.getPendingOperations();
    setPendingOperations(operations.map(op => ({ type: op.type, data: op.data })));
  }, []);

  useEffect(() => {
    // If we come back online, sync and return to dashboard
    if (isOnline && isServerAvailable) {
      onBackToDashboard();
    }
  }, [isOnline, isServerAvailable, onBackToDashboard]);

  const handleDeleteTraining = (date: string) => {
    const updatedTrainings = trainings.filter(t => t.date !== date);
    setTrainings(updatedTrainings);
    offlineStorage.saveTrainings(updatedTrainings);
    
    // Add to pending operations
    const trainingToDelete = trainings.find(t => t.date === date);
    if (trainingToDelete) {
      offlineStorage.addPendingOperation({
        type: 'DELETE',
        data: trainingToDelete,
        timestamp: Date.now()
      });
      setPendingOperations(prev => [...prev, { type: 'DELETE', data: trainingToDelete }]);
    }
  };

  const handleUpdateTraining = (updatedTraining: TrainingEntry) => {
    const updatedTrainings = trainings.map(t => 
      t.date === updatedTraining.date ? updatedTraining : t
    );
    setTrainings(updatedTrainings);
    offlineStorage.saveTrainings(updatedTrainings);
    
    // Add to pending operations
    offlineStorage.addPendingOperation({
      type: 'UPDATE',
      data: updatedTraining,
      timestamp: Date.now()
    });
    setPendingOperations(prev => [...prev, { type: 'UPDATE', data: updatedTraining }]);
  };

  return (
    <div className="min-h-screen w-full overflow-y-auto p-8" style={{
      background: "linear-gradient(to bottom, #09205A 31%, #4E6496 90%, #C2D8FB 100%)"
    }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Offline Session</h1>
          <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg">
            Working Offline - Changes will sync when back online
          </div>
        </div>

        {/* Pending Operations Queue */}
        <div className="bg-white bg-opacity-10 p-6 rounded-xl mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Pending Operations</h2>
          <div className="space-y-2">
            {pendingOperations.map((op, index) => (
              <div key={index} className="bg-white bg-opacity-20 p-3 rounded-lg">
                <p className="text-white">
                  {op.type}: {new Date(op.data.date).toLocaleDateString()}
                </p>
              </div>
            ))}
            {pendingOperations.length === 0 && (
              <p className="text-white text-opacity-70">No pending operations</p>
            )}
          </div>
        </div>

        {/* Offline Trainings List */}
        <div className="bg-white bg-opacity-10 p-6 rounded-xl">
          <h2 className="text-xl font-bold text-white mb-4">Your Trainings</h2>
          <div className="space-y-4">
            {trainings.map((training) => (
              <div key={training.date} className="bg-white bg-opacity-20 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-medium">
                    {new Date(training.date).toLocaleDateString()}
                  </h3>
                  <button
                    onClick={() => handleDeleteTraining(training.date)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
                <div className="space-y-2">
                  {Object.entries(training.exercises).map(([exercise, weight]) => (
                    <div key={exercise} className="flex justify-between">
                      <span className="text-white">{exercise}</span>
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => handleUpdateTraining({
                          ...training,
                          exercises: {
                            ...training.exercises,
                            [exercise]: Number(e.target.value)
                          }
                        })}
                        className="bg-white bg-opacity-20 text-white w-20 px-2 py-1 rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {trainings.length === 0 && (
              <p className="text-white text-opacity-70">No trainings recorded offline</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineSessionPage; 