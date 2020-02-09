require('dotenv').config();

module.exports = {
  'migrationDirectory': 'migrations',
  'driver': 'pg',
  'connectionString': (process.env.NODE_ENV === 'test')
    ? process.env.TEST_DBURL
    : process.env.DB_URL,
  'ssl': !!process.env.SSL,
};