export interface AppSettingInterface {
    url: string;
    secret: string;
    port: string | number;
}

export interface MongoSettingInterface {
    cluster: string;
    user: string;
    password: string;
    database: string;
}

export interface ConfigInterface {
    app: AppSettingInterface;
    mongo: MongoSettingInterface;
}