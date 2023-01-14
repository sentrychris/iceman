export interface Repository<T> {
    path: string;
    storeToJson(key: string): Promise<T>;
    storeJsonToMongoDb(key?: string | null): Promise<T>;
}