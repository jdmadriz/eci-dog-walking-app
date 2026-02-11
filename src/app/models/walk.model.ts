export type WalkStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled';

export interface Walk {
    id: string;
    dogId: string;
    date: string; // ISO date string
    duration: number; // in minutes
    status: WalkStatus;
    notes: string;
    createdAt: string; // ISO date string
}