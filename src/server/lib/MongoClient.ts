import { Collection, MongoClient as MongoConnection } from 'mongodb'
import type { ConnectionInterface } from '../interfaces/ConnectionInterface'

export class MongoClient implements ConnectionInterface<Collection> {
    protected client: MongoConnection
    
    constructor(
        public readonly cluster: string,
        public readonly username: string,
        public readonly password: string,
        public readonly database: string
    ) {
        this.client = new MongoConnection(
            `mongodb+srv://${username}:${password}@${cluster}/${database}?retryWrites=true&w=majority`
        )
    }
    
    async getCollection(collection: string) {
        await this.client.connect();
        return this.client.db().collection(collection)
    }
    
    async closeConnection() {
        this.client.close()
    }
}