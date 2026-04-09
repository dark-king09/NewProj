import { useOutletContext } from "react-router-dom";
import { LoadingBlock } from "../components/LoadingBlock";
import { SectionHeading } from "../components/SectionHeading";
import { StatCard } from "../components/StatCard";
import { StoryCard } from "../components/StoryCard";

export const ImpactPage = () => {
  const { content, loading } = useOutletContext();

  if (loading) {
    return <LoadingBlock message="Collecting impact highlights..." />;
  }

  return (
    <div className="page-shell">
      <section className="page-hero page-hero--impact">
        <div className="container narrow">
          <p className="eyebrow">Impact</p>
          <h1>Evidence that stays human, local, and partner-ready.</h1>
          <p>
            This page turns raw program activity into a cleaner story for institutions, donors,
            grant reviewers, employers, and community stakeholders.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="stats-grid">
            {content.stats.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--muted">
        <div className="container split-section">
          <div>
            <SectionHeading
              eyebrow="What the numbers mean"
              title="Reach is only meaningful when it translates into stronger daily learning and work-readiness experiences."
              description="A market-ready impact page should make room for operational clarity, not just promotional claims. This layout is built for that."
            />
            <div className="impact-points">
              <div>
                <strong>Continuity</strong>
                <p>How many students keep progressing through critical education stages.</p>
              </div>
              <div>
                <strong>Capability</strong>
                <p>How teachers, mentors, and youth gain the tools to sustain outcomes independently.</p>
              </div>
              <div>
                <strong>Credibility</strong>
                <p>How partners can trace the logic between inputs, delivery, and outcomes.</p>
              </div>
            </div>
          </div>
          {content.featuredStory ? <StoryCard story={content.featuredStory} compact /> : null}
        </div>
      </section>
    </div>
  );
};
