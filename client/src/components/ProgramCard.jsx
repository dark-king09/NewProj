import { resolveAssetUrl } from "../services/api";

export const ProgramCard = ({ program }) => (
  <article className="card card--program">
    <div
      className="card-media"
      style={{ backgroundImage: `linear-gradient(180deg, transparent, rgba(9, 17, 12, 0.8)), url(${resolveAssetUrl(program.imageUrl)})` }}
    >
      <span className="pill">{program.audience}</span>
    </div>
    <div className="card-body">
      <div className="card-topline">
        <span>{program.location}</span>
        <strong>{program.impactMetric}</strong>
      </div>
      <h3>{program.title}</h3>
      <p>{program.summary}</p>
      <div className="tag-row">
        {(program.focusAreas || []).slice(0, 3).map((focusArea) => (
          <span key={focusArea} className="tag">
            {focusArea}
          </span>
        ))}
      </div>
    </div>
  </article>
);
