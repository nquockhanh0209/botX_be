import { Module } from "@nestjs/common";
import {
  ConfigModule,
  ConfigService,
} from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                type: "postgres",
                replication: {
                    master: {
                        host: configService.get<string>("databaseHost"),
                        port: configService.get<number>("databasePort"),
                        username: configService.get<string>("databaseUsername"),
                        password: configService.get<string>("databasePassword"),
                        database: configService.get<string>("databaseName"),
                    },
                    slaves: [{
                        host: configService.get<string>("databaseSlaveHost") || configService.get<string>("databaseHost"),
                        port: configService.get<number>("databaseSlavePort") || configService.get<number>("databasePort"),
                        username: configService.get<string>("databaseSlaveUsername") || configService.get<string>("databaseUsername"),
                        password: configService.get<string>("databaseSlavePassword") || configService.get<string>("databasePassword"),
                        database: configService.get<string>("databaseSlaveName") || configService.get<string>("databaseName"),
                    }],
                },
                entities: [
                    __dirname + "/../entities/*{.ts,.js}"
                ],
            }),
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule { }


// import { DataSource, DataSourceOptions } from "typeorm";
// require('dotenv').config()

// export const dataSourceOptions: DataSourceOptions = {
//     type: 'postgres',
//     host: process.env.DATABASE_HOST,
//     port: +process.env.DATABASE_HOST_PORT!,
//     username: process.env.DATABASE_USER,
//     password: process.env.DATABASE_PASSWORD,
//     database: process.env.DATABASE_NAME,
//     entities: [
//         __dirname + "/../entities/*{.ts,.js}"
//     ],
//     synchronize: false
// };

// const dataSource = new DataSource(dataSourceOptions);
// export default dataSource;