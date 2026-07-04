export default function FeatureCard({ title, desc, icon }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>

      <h3>{title}</h3>

      <p>{desc}</p>
    </div>
  );
}