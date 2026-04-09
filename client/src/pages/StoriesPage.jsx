import { useOutletContext } from "react-router-dom";
import { LoadingBlock } from "../components/LoadingBlock";
import { SectionHeading } from "../components/SectionHeading";
import { StoryCard } from "../components/StoryCard";

export const StoriesPage = () => {
  const { content, loading } = useOutletContext();

  if (loading) {
    return <LoadingBlock message="Loading field stories..." />;
  }

  return (
    <div className="page-shell">
      <section className="page-hero page-hero--stories">
        <div className="container narrow">
          <p className="eyebrow">Stories</p>
          <h1>Field stories that keep the work grounded in real places and real learners.</h1>
          <p>
            Use this page for narrative proof, donor reports, campaign content, or community
            storytelling that feels credible rather than generic.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Voices from the field"
            title="A strong rural education and skill development platform keeps stories close to outcomes."
            description="Every story card below is editable from the admin dashboard, including quote, tags, and cover image."
          />
          <div className="story-grid">
            {content.stories.map((story) => (
              <StoryCard key={story._id} story={story} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
