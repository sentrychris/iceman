import { Repository } from "./Repository";

export interface Importer<T> {
    repository: Repository<T>;
    json(key?: unknown | null): Promise<T | Array<T>>;
    mongo(key?: unknown | null): Promise<T | Array<T>>;
}