export = {
  host: process.env.DATABASE_HOST_PORT,
  type: "postgres",
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  migrations: ["src/database/migrations/*.ts"],
  cli: {
    migrationsDir: "src/database/migrations",
    entitiesDir: "src/entities",
  },
};
