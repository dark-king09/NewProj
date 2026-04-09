import { useOutletContext } from "react-router-dom";
import { LoadingBlock } from "../components/LoadingBlock";
import { ProgramCard } from "../components/ProgramCard";
import { SectionHeading } from "../components/SectionHeading";

export const ProgramsPage = () => {
  const { content, loading } = useOutletContext();

  if (loading) {
    return <LoadingBlock message="Loading education and skill pathways..." />;
  }

  return (
    <div className="page-shell">
      <section className="page-hero">
        <div className="container narrow">
          <p className="eyebrow">Programs</p>
          <h1>Program design that reflects the full reality of rural learning and skilling ecosystems.</h1>
          <p>
            These initiatives are structured to support students, youth, teachers, and families
            together, not as disconnected interventions.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="card-grid">
            {content.programs.map((program) => (
              <ProgramCard key={program._id} program={program} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--accent">
        <div className="container">
          <SectionHeading
            eyebrow="Delivery model"
            title="A three-layer approach for stronger rural education and skill development systems"
            description="The platform can easily expand this model into dedicated pages, case studies, employer partnerships, or donor microsites."
          />
          <div className="feature-grid">
            <article className="feature-card">
              <h3>Layer 1: Student support</h3>
              <p>Foundational learning, mentoring, enrichment, and transition support.</p>
            </article>
            <article className="feature-card">
              <h3>Layer 2: Skill readiness</h3>
              <p>Digital fluency, maker activities, career guidance, and enterprise exposure.</p>
            </article>
            <article className="feature-card">
              <h3>Layer 3: Community alignment</h3>
              <p>Parent engagement, training partnerships, and field-responsive problem solving.</p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
};
