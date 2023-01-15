import { Repository } from "./Repository";

export interface Importer<T> {
    repository: Repository<T>;
    json(key?: unknown | null): Promise<T>;
    mongo(key?: unknown | null): Promise<T>;
}