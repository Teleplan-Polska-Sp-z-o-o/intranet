import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config({ path: "./../.env" });

const options: DataSourceOptions = {
  type: "postgres",
  host: process.env.HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [`${__dirname}/../orm/entity/**/*Entity.js`],
  migrations: [`${__dirname}/../orm/migrations/*Migration.ts`],
};

const dataSource = new DataSource(options);

export { dataSource };
