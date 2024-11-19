import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config({ path: "./../.env" });

export namespace SideDataSources {
  // side dbs for analytics tools
  const sidePostgresOptions: DataSourceOptions = {
    type: "postgres",
    host: process.env.SIDE_POSTGRES_HOST,
    port: parseInt(process.env.SIDE_POSTGRES_PORT),
    username: process.env.SIDE_POSTGRES_USER,
    password: process.env.SIDE_POSTGRES_PASSWORD,
    database: process.env.SIDE_POSTGRES_DB,
    entities: [`${__dirname}/../orm/sideEntity/postgres/**/*Entity.js`],
    synchronize: false, // No schema sync, just reading data
  };

  const sideMsSqlOptions: DataSourceOptions = {
    type: "mssql",
    host: process.env.SIDE_MSSQL_HOST,
    port: parseInt(process.env.SIDE_MSSQL_PORT),
    username: process.env.SIDE_MSSQL_USER,
    password: process.env.SIDE_MSSQL_PASSWORD,
    database: process.env.SIDE_MSSQL_DB,
    options: { encrypt: true, trustServerCertificate: true },
    entities: [`${__dirname}/../orm/sideEntity/mssql/**/*Entity.js`],
    synchronize: false, // No schema sync, just reading data
  };

  export const postgres: DataSource = new DataSource(sidePostgresOptions);
  export const mssql: DataSource = new DataSource(sideMsSqlOptions);
}
