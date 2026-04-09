export const StatCard = ({ stat }) => (
  <article className="stat-card">
    <strong>{stat.value}</strong>
    <span>{stat.label}</span>
  </article>
);
