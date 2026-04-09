import { resolveAssetUrl } from "../services/api";

export const StoryCard = ({ story, compact = false }) => (
  <article className={`story-card ${compact ? "story-card--compact" : ""}`}>
    <div
      className="story-card__image"
      style={{ backgroundImage: `url(${resolveAssetUrl(story.coverImage)})` }}
    />
    <div className="story-card__content">
      <div className="card-topline">
        <span>{story.location}</span>
        <strong>{story.storyteller}</strong>
      </div>
      <h3>{story.title}</h3>
      <p>{story.summary}</p>
      <blockquote>{story.quote}</blockquote>
      <div className="tag-row">
        {(story.tags || []).map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
    </div>
  </article>
);
