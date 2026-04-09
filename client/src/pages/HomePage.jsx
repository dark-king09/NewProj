import { Link, useOutletContext } from "react-router-dom";
import { LoadingBlock } from "../components/LoadingBlock";
import { ProgramCard } from "../components/ProgramCard";
import { ResourceCard } from "../components/ResourceCard";
import { SectionHeading } from "../components/SectionHeading";
import { StatCard } from "../components/StatCard";
import { StoryCard } from "../components/StoryCard";

export const HomePage = () => {
  const { content, loading } = useOutletContext();

  if (loading) {
    return <LoadingBlock message="Building the rural learning and skills story..." />;
  }

  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Rural education and skill development, designed for reach</p>
            <h1>
              A modern platform for programs, partnerships, and stories that move learning,
              skilling, and opportunity closer to every village.
            </h1>
            <p>
              This platform helps organizations present their education and skill development
              mission with clarity, manage content securely, and turn field impact into a
              compelling digital presence.
            </p>
            <div className="hero-actions">
              <Link to="/programs" className="button button--primary">
                Explore Programs
              </Link>
              <Link to="/contact" className="button button--secondary">
                Partner With Us
              </Link>
            </div>
          </div>
          <div className="hero-panel">
            <div className="hero-panel__card">
              <span>Focus areas</span>
              <strong>Learning, employability, digital confidence</strong>
              <p>
                Built to communicate how rural learning and skilling work actually happens: in
                classrooms, labs, homes, learning circles, and local partnerships.
              </p>
            </div>
            <div className="hero-panel__grid">
              {content.stats.map((stat) => (
                <StatCard key={stat.label} stat={stat} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Why it matters"
            title="Rural progress needs more than school access. It needs continuity, practical skills, and local trust."
            description="This platform is designed to help organizations show a layered model of rural education and skill development, from student mentoring and teacher training to employability support, scholarship continuity, and resource access."
          />
          <div className="feature-grid">
            <article className="feature-card">
              <h3>Learning-to-livelihood pathways</h3>
              <p>
                Show how learners move from foundational support to transition readiness, digital
                fluency, and long-term opportunity.
              </p>
            </article>
            <article className="feature-card">
              <h3>Community-first skill building</h3>
              <p>
                Highlight the role of families, local mentors, teachers, training partners, and
                village institutions in durable change.
              </p>
            </article>
            <article className="feature-card">
              <h3>Ready for fundraising</h3>
              <p>
                Give donors and partners a clear view of outcomes, stories, and action-ready
                education and skilling pathways.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section section--accent">
        <div className="container">
          <SectionHeading
            eyebrow="Programs"
            title="Layered initiatives designed for real rural conditions"
            description="Each program card below is database-backed, so your team can adapt content, imagery, and messaging as the organization grows."
          />
          <div className="card-grid">
            {content.programs.slice(0, 3).map((program) => (
              <ProgramCard key={program._id} program={program} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split-section">
          <div>
            <SectionHeading
              eyebrow="Impact frame"
              title="Measure learning outcomes in ways partners can understand quickly."
              description="The site structure makes it easy to spotlight community reach, educator support, skill readiness, retention progress, and resource distribution without flattening the story into a single metric."
            />
            <div className="impact-points">
              <div>
                <strong>Retention</strong>
                <p>Track student continuation into higher grades and critical transition years.</p>
              </div>
              <div>
                <strong>Readiness</strong>
                <p>Show improvements in literacy, STEM confidence, digital skills, and career preparedness.</p>
              </div>
              <div>
                <strong>Reach</strong>
                <p>Capture district-level scale while keeping the local human story visible.</p>
              </div>
            </div>
          </div>
          {content.featuredStory ? <StoryCard story={content.featuredStory} compact /> : null}
        </div>
      </section>

      <section className="section section--muted">
        <div className="container">
          <SectionHeading
            eyebrow="Resource hub"
            title="Give schools, families, and teachers something useful the moment they arrive."
            description="Resources create repeat value and make the platform useful even between campaigns, field visits, or fundraising cycles."
          />
          <div className="resource-grid">
            {content.resources.map((resource) => (
              <ResourceCard key={resource._id} resource={resource} />
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-band">
        <div className="container cta-band__inner">
          <div>
            <p className="eyebrow">Built to evolve</p>
            <h2>This website is structured so your team can keep changing content without rebuilding the product.</h2>
          </div>
          <Link to="/admin/login" className="button button--primary">
            Open Admin Panel
          </Link>
        </div>
      </section>
    </>
  );
};
