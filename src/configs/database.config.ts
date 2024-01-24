export default (): Record<string, unknown> => ({
  databaseConnection: process.env.DATABASE_CONNECTION || "postgres",
  databaseHost: process.env.DATABASE_HOST,
  databasePort: process.env.DATABASE_HOST_PORT || 5432,
  databaseUsername: process.env.DATABASE_USER,
  databasePassword: process.env.DATABASE_PASSWORD,
  databaseName: process.env.DATABASE_NAME,
  databaseSlaveHost:
    process.env.DATABASE_SLAVE_HOST || process.env.DATABASE_HOST,
  databaseSlavePort:
    parseInt(
      process.env.DATABASE_SLAVE_PORT || process.env.DATABASE_HOST_PORT,
      10,
    ) || 5432,
  databaseSlaveUsername:
    process.env.DATABASE_SLAVE_USERNAME || process.env.DATABASE_USER,
  databaseSlavePassword:
    process.env.DATABASE_SLAVE_PASSWORD || process.env.DATABASE_PASSWORD,
  databaseSlaveName:
    process.env.DATABASE_SLAVE_DB_NAME || process.env.DATABASE_NAME,
  // timezone: 'Asia/Ho_Chi_Minh',
  // dialectOptions: {
  //   timezone: 'local',
  // },
});
