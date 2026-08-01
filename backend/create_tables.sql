-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "weight" FLOAT,
  "height" FLOAT,
  "gender" VARCHAR(50),
  "age" INTEGER,
  "timesPerWeek" INTEGER,
  "timePerSession" INTEGER,
  "repRange" VARCHAR(50),
  "isAdmin" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trainings table
CREATE TABLE IF NOT EXISTS "trainings" (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER REFERENCES "users"(id) ON DELETE CASCADE,
  "date" DATE NOT NULL,
  "exercises" JSONB NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create exercises table
CREATE TABLE IF NOT EXISTS "exercises" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "muscleGroup" VARCHAR(255),
  "description" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create training_exercises table
CREATE TABLE IF NOT EXISTS "training_exercises" (
  "id" SERIAL PRIMARY KEY,
  "trainingId" INTEGER REFERENCES "trainings"(id) ON DELETE CASCADE,
  "exerciseId" INTEGER REFERENCES "exercises"(id) ON DELETE CASCADE,
  "weight" FLOAT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create activity_logs table
CREATE TABLE IF NOT EXISTS "activity_logs" (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER REFERENCES "users"(id) ON DELETE CASCADE,
  "action" VARCHAR(50) NOT NULL,
  "entityType" VARCHAR(50) NOT NULL,
  "entityId" VARCHAR(255),
  "details" JSONB,
  "timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert a test user with hashed password (password: password123)
INSERT INTO "users" ("name", "email", "password", "isAdmin")
VALUES ('Test User', 'test@example.com', '$2a$10$1Gm/P4JrOH9H5cJKFqH.9.XWy0sLZGzW.Qh0D.qoXMp.FS9OMzO86', true); 