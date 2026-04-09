import { resolveAssetUrl } from "../services/api";

export const ResourceCard = ({ resource }) => {
  const resourceUrl = resolveAssetUrl(resource.url);

  return (
    <article className="resource-card">
      <div
        className="resource-card__image"
        style={{ backgroundImage: `url(${resolveAssetUrl(resource.imageUrl)})` }}
      />
      <div className="resource-card__content">
        <span className="pill pill--soft">{resource.category}</span>
        <h3>{resource.title}</h3>
        <p>{resource.summary}</p>
        <a href={resourceUrl} target="_blank" rel="noreferrer">
          {resource.ctaLabel}
        </a>
      </div>
    </article>
  );
};
