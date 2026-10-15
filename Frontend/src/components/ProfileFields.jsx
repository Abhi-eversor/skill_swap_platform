export default function ProfileFields({ form, setForm }) {
  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }));
  return <div className="form-grid">
    <label>Name<input name="name" required autoComplete="name" maxLength={100} value={form.name} onChange={change} /></label>
    <label>Location<input name="location" autoComplete="address-level2" maxLength={160} value={form.location} onChange={change} /></label>
    <label>Skills offered<input name="skillsOffered" placeholder="Python, Photography" value={form.skillsOffered} onChange={change} /><span className="field-help">Separate skills with commas.</span></label>
    <label>Skills wanted<input name="skillsWanted" placeholder="Guitar, Graphic design" value={form.skillsWanted} onChange={change} /><span className="field-help">Separate skills with commas.</span></label>
    <label>Availability<input name="availability" placeholder="Weekends, Evenings" value={form.availability} onChange={change} /><span className="field-help">Separate times with commas.</span></label>
    <label>Profile photo URL<input name="profilePhoto" type="url" placeholder="https://..." pattern="https?://.*" maxLength={2048} value={form.profilePhoto} onChange={change} /></label>
    <label className="form-full">Bio<textarea name="bio" rows={3} maxLength={2000} value={form.bio} onChange={change} /></label>
    <label className="checkbox-label form-full"><input type="checkbox" name="isPublic" checked={form.isPublic} onChange={change} /> Show my profile in public searches</label>
  </div>;
}
