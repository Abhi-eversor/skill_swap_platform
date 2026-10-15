require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const { validateEnvironment } = require('./config/env');

async function start() {
  const config = validateEnvironment(process.env);
  await connectDB(config.mongoUri);
  return app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}

if (require.main === module) {
  start().catch((error) => {
    console.error(`Could not start server: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = { app, start };
