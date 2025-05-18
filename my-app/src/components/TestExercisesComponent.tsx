import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

interface ExerciseCategory {
  category: string;
  exercises: string[];
}

const TestExercisesComponent: React.FC = () => {
  const [exercises, setExercises] = useState<ExerciseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching exercises from', `${API_BASE_URL}/exercises`);
        const response = await fetch(`${API_BASE_URL}/exercises`);
        
        console.log('Response status:', response.status);
        if (!response.ok) {
          throw new Error(`Failed to fetch exercises: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Exercises data:', data);
        
        setExercises(data);
      } catch (err) {
        console.error('Error fetching exercises:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Exercise Categories Test</h2>
      
      {loading && <p className="text-gray-600">Loading exercises...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
      
      {!loading && !error && (
        <>
          <p className="mb-2 text-green-600 font-semibold">
            Successfully loaded {exercises.length} exercise categories with a total of {
              exercises.reduce((sum, category) => sum + category.exercises.length, 0)
            } exercises.
          </p>
          
          <div className="space-y-4">
            {exercises.map((category) => (
              <div key={category.category} className="border rounded p-3">
                <h3 className="font-bold text-lg">{category.category}</h3>
                <ul className="list-disc list-inside">
                  {category.exercises.map((exercise) => (
                    <li key={exercise}>{exercise}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TestExercisesComponent; 