const publicFields = 'name location profilePhoto skillsOffered skillsWanted availability isPublic bio';

function safeProfile(user, includeEmail = false) {
  if (!user) return null;
  const id = String(user._id);
  const profile = {
    _id: id,
    id,
    name: user.name,
    location: user.location || '',
    profilePhoto: user.profilePhoto || '',
    skillsOffered: user.skillsOffered || [],
    skillsWanted: user.skillsWanted || [],
    availability: user.availability || [],
    isPublic: user.isPublic !== false,
    bio: user.bio || '',
  };
  if (includeEmail) profile.email = user.email;
  return profile;
}

function safeSwap(swap) {
  return {
    _id: String(swap._id),
    id: String(swap._id),
    requester: safeProfile(swap.requester),
    responder: safeProfile(swap.responder),
    skillOffered: swap.skillOffered,
    skillRequested: swap.skillRequested,
    message: swap.message || '',
    status: swap.status,
    createdAt: swap.createdAt,
    updatedAt: swap.updatedAt,
  };
}

module.exports = { publicFields, safeProfile, safeSwap };
