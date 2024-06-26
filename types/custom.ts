export type Transaction = {
    id: number;
    created_at: string;
    amount: number;
    type: string | null;
    description: string | null;
    category: string | null;
}

export type Period = {
    from: Date,
    to: Date
}