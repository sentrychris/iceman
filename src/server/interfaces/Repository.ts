export interface Repository {
    path: string;
    storeToJson(key: string): Promise<void>;
    storeJsonToMongoDb(key?: string | null): Promise<void>;
}