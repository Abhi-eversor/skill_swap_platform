export default function Skills({ title, items = [], wanted = false }) {
  return <div className="skill-group">
    <p className="font-semibold text-gray-700">{title}</p>
    <div className="skill-list">
      {items.length ? items.map((skill) => <span key={skill} className={`skill${wanted ? ' skill-wanted' : ''}`}>{skill}</span>) : <span className="text-gray-500 text-sm">None added yet</span>}
    </div>
  </div>;
}
