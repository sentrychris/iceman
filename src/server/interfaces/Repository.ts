export interface Repository<T> {
    path: string;
    collection: T;
    storeToJsonFile(key: string): Promise<T>;
    storeJsonFileToMongoDb(key?: string | null): Promise<void>;
}