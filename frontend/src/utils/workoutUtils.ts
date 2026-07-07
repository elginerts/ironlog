export function calculateWorkoutVolume(
    sets: number,
    reps: number,
    weight: number
) : number {
    return sets * reps * weight;
}

export function isValidWorkoutInput(
    exerciseName: string,
    sets: number,
    reps: number,
    weight: number
) : boolean {
    return ( exerciseName.trim().length > 0 &&
    sets > 0 &&
    reps > 0 &&
    weight >= 0
    );
}
