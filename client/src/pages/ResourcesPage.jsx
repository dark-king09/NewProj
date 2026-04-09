import { useOutletContext } from "react-router-dom";
import { LoadingBlock } from "../components/LoadingBlock";
import { ResourceCard } from "../components/ResourceCard";
import { SectionHeading } from "../components/SectionHeading";

export const ResourcesPage = () => {
  const { content, loading } = useOutletContext();

  if (loading) {
    return <LoadingBlock message="Opening the resource library..." />;
  }

  return (
    <div className="page-shell">
      <section className="page-hero page-hero--resources">
        <div className="container narrow">
          <p className="eyebrow">Resources</p>
          <h1>A resource hub that gives practical value to schools, teachers, families, and youth skilling teams.</h1>
          <p>
            This section can grow into downloads, partner kits, scholarship directories, career
            guidance material, or district-specific content over time.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="resource-grid">
            {content.resources.map((resource) => (
              <ResourceCard key={resource._id} resource={resource} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--accent">
        <div className="container">
          <SectionHeading
            eyebrow="Expand later"
            title="The backend is already set up for change."
            description="Add more resource categories, downloadable PDFs, training kits, or partner-only libraries later without reworking the full site structure."
          />
        </div>
      </section>
    </div>
  );
};
