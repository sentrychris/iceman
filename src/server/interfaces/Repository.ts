export interface Repository<T> {
    path: string;
    collection: Array<T>;
    storeToJsonFile(key: string): Promise<Array<T>>;
    storeJsonFileToMongoDb(key?: string | null): Promise<any>;
    clearCollection(): void;
}