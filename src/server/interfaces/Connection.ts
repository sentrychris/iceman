export interface Connection<T> {
    cluster: string;
    username: string;
    password: string;
    database: string;
    getCollection: (collection: string) => Promise<T>;
    closeConnection: () => void;
}