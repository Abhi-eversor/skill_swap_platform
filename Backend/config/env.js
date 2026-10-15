function validateEnvironment(env) {
  if (!/^mongodb(?:\+srv)?:\/\//.test(env.MONGO_URI || '')) {
    throw new Error('MONGO_URI must be a MongoDB connection string');
  }
  if (!env.JWT_SECRET || env.JWT_SECRET.length < 32
      || /change.?me|replace|your.?secret|example/i.test(env.JWT_SECRET)) {
    throw new Error('Set JWT_SECRET to a random secret of at least 32 characters');
  }
  const origins = (env.FRONTEND_URL || '').split(',').map((origin) => origin.trim());
  if (!origins.length || origins.some((origin) => {
    try {
      const url = new URL(origin);
      return !['http:', 'https:'].includes(url.protocol) || url.origin !== origin;
    } catch {
      return true;
    }
  })) {
    throw new Error('FRONTEND_URL must contain the allowed frontend origin');
  }
  const port = Number(env.PORT || 5000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be between 1 and 65535');
  }
  return { mongoUri: env.MONGO_URI, port };
}

module.exports = { validateEnvironment };
