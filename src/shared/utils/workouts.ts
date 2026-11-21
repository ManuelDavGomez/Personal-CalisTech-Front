export interface WorkoutSet {
  reps: number;
  weight: number;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  difficulty: string;
  image: string;
  muscles?: string[];
  setsCompleted?: number;
  sets: WorkoutSet[];
}

export interface WorkoutRecord {
  id: string;
  userId: string;
  name: string;
  date: string;
  durationSeconds: number;
  exercises: WorkoutExercise[];
}

const WORKOUT_STORAGE_KEY = "CalisTechWorkouts";

export const getWorkouts = (userId?: string | number | null): WorkoutRecord[] => {
  if (typeof window === "undefined") return [];

  try {
    const records = JSON.parse(localStorage.getItem(WORKOUT_STORAGE_KEY) || "[]") as WorkoutRecord[];
    const userKey = userId == null ? "" : String(userId);
    if (!userKey) return records;
    return records.filter((record) => record.userId === userKey);
  } catch {
    return [];
  }
};

export const saveWorkout = (
  workout: Omit<WorkoutRecord, "id" | "userId">,
  userId?: string | number | null,
) => {
  const existing = getWorkouts();
  const record: WorkoutRecord = {
    ...workout,
    id: crypto.randomUUID(),
    userId: userId == null ? "guest" : String(userId),
  };

  localStorage.setItem(WORKOUT_STORAGE_KEY, JSON.stringify([record, ...existing]));
  return record;
};

export const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
};
