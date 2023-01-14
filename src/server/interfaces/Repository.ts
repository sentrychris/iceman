export interface Repository {
    path: string;
    storeToJson(key: string): void;
    storeJsonToMongoDb(key?: string | null): void;
}