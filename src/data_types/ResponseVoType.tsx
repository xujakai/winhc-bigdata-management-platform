export interface ResponseVoType<T> {
    success: boolean;
    msg: string;
    data: T | null
}


export interface IPage<T> {
    current: number;
    pages: number;
    records: T[];
    size: number;
    total: number;
}