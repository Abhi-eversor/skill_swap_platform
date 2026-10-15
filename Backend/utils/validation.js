const { HttpError } = require('./errors');

const profileFields = ['name', 'location', 'profilePhoto', 'skillsOffered', 'skillsWanted',
  'availability', 'isPublic', 'bio'];

function checkFields(body, allowed) {
  if (Object.keys(body).some((key) => !allowed.includes(key))) {
    throw new HttpError(400, 'The request contains unsupported fields');
  }
}

function text(value, field, { max = 100, required = false } = {}) {
  if (typeof value !== 'string' || value.trim().length > max
      || (required && !value.trim())) {
    throw new HttpError(400, `Provide a valid ${field}`);
  }
  return value.trim();
}

function stringList(value, field, maxItems = 20) {
  if (!Array.isArray(value) || value.length > maxItems) {
    throw new HttpError(400, `${field} must be a list of up to ${maxItems} items`);
  }
  const seen = new Set();
  return value.map((item) => text(item, field, { max: 60, required: true }))
    .filter((item) => {
      const key = item.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function profileInput(body) {
  const profile = {};
  for (const field of ['name', 'location', 'bio', 'profilePhoto']) {
    if (body[field] !== undefined) {
      const max = { name: 100, location: 160, bio: 2000, profilePhoto: 2048 }[field];
      profile[field] = text(body[field], field, { max, required: field === 'name' });
    }
  }
  if (profile.profilePhoto) {
    let url;
    try { url = new URL(profile.profilePhoto); } catch { url = null; }
    if (!url || !['http:', 'https:'].includes(url.protocol)) {
      throw new HttpError(400, 'Profile photo must be an HTTP or HTTPS URL');
    }
  }
  for (const field of ['skillsOffered', 'skillsWanted', 'availability']) {
    if (body[field] !== undefined) {
      profile[field] = stringList(body[field], field, field === 'availability' ? 14 : 20);
    }
  }
  if (body.isPublic !== undefined) {
    if (typeof body.isPublic !== 'boolean') {
      throw new HttpError(400, 'isPublic must be true or false');
    }
    profile.isPublic = body.isPublic;
  }
  return profile;
}

function credentials(body, registration = false) {
  const email = text(body.email, 'email', { max: 254, required: true }).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpError(400, 'Provide a valid email');
  }
  const password = body.password;
  if (typeof password !== 'string' || !password || Buffer.byteLength(password, 'utf8') > 72
      || (registration && password.length < 8)) {
    throw new HttpError(400, registration
      ? 'Password must contain at least 8 characters and at most 72 bytes'
      : 'Provide a valid password');
  }
  return { email, password };
}

function validId(value) {
  return typeof value === 'string' && /^[a-f\d]{24}$/i.test(value);
}

module.exports = { profileFields, checkFields, text, profileInput, credentials, validId };
