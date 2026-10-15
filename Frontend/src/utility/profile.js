export const emptyProfile = {
  name: '', location: '', profilePhoto: '', skillsOffered: '', skillsWanted: '', availability: '', isPublic: true, bio: '',
};

export function profileToForm(user) {
  return {
    name: user.name || '',
    location: user.location || '',
    profilePhoto: user.profilePhoto || '',
    skillsOffered: (user.skillsOffered || []).join(', '),
    skillsWanted: (user.skillsWanted || []).join(', '),
    availability: (user.availability || []).join(', '),
    isPublic: user.isPublic !== false,
    bio: user.bio || '',
  };
}

export function profileToPayload(form) {
  const split = (value) => [...new Set(value.split(',').map((item) => item.trim()).filter(Boolean))];
  return {
    name: form.name.trim(),
    location: form.location.trim(),
    profilePhoto: form.profilePhoto.trim(),
    skillsOffered: split(form.skillsOffered),
    skillsWanted: split(form.skillsWanted),
    availability: split(form.availability),
    isPublic: form.isPublic,
    bio: form.bio.trim(),
  };
}
