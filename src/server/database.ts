import { Collection } from 'mongodb';
import { MongoClient } from './lib/MongoClient';
import { settings } from  './config';
import type { ConnectionInterface } from './interfaces/ConnectionInterface';

export const client: ConnectionInterface<Collection> = new MongoClient(
    settings.mongo.cluster,
    settings.mongo.user,
    settings.mongo.password,
    settings.mongo.database
);