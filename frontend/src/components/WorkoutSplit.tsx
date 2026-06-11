import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

type WorkoutSplit = {
    id: number;
    user_id: string;
    name: string;
};



type WorkoutSplitDay = {
    id: number;
    workout_split_id: number;
    day_order: number;
    day_of_week: string;
};

type WorkoutDayExercises = {
    id: number;
    workout_split_day_id: number;
    exercise_name: string;
    exercise_id: number;
    sets: number;
    reps: number;
    weight: number;
    exercise_order: number;
};

type WorkoutSplitProps = {
    userId: string;
};