export interface AppSettings {
    url: string;
    secret: string;
    port: string | number;
}

export interface MongoSettings {
    cluster: string;
    user: string;
    password: string;
    database: string;
}

export interface Configuration {
    app: AppSettings;
    mongo: MongoSettings;
}