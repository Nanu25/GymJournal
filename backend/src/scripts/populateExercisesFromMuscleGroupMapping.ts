import { AppDataSource } from '../config/database';
import { Exercise } from '../entities/Exercise';
import * as path from 'path';
import * as fs from 'fs';

async function main() {
  await AppDataSource.initialize();
  const exerciseRepo = AppDataSource.getRepository(Exercise);

  // Load the mapping data
  const dataPath = path.join(__dirname, '../data/muscleGroupMappingData.json');
  const mapping = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  let added = 0;
  let skipped = 0;

  for (const [name, muscleGroup] of Object.entries(mapping)) {
    const exists = await exerciseRepo.findOne({ where: { name } });
    if (exists) {
      skipped++;
      continue;
    }
    const exercise = new Exercise();
    exercise.name = name;
    exercise.muscleGroup = muscleGroup as string;
    await exerciseRepo.save(exercise);
    added++;
  }

  console.log(`Done! Added: ${added}, Skipped (already existed): ${skipped}`);
  await AppDataSource.destroy();
}

main().catch(err => {
  console.error('Error populating exercises:', err);
  process.exit(1);
}); 