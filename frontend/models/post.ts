export default interface IPost {
    id: number;
    content: string;
    created_at: Date;
    updated_at: Date | null;
    deleted_at: Date | null;
    userId: number;
    sentiment?: string;
    correction?: string;
}