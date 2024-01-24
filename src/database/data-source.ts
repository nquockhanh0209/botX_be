import { DataSource, DataSourceOptions } from "typeorm";
require('dotenv').config()

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT!,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [
        'dist/src/entities/*.js'
    ],
    migrations: [
        'dist/src/database/migrations/*.js'
    ],
    synchronize: false
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;