export const SectionHeading = ({ eyebrow, title, description, align = "left" }) => (
  <div className={`section-heading section-heading--${align}`}>
    {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
    <h2>{title}</h2>
    {description ? <p>{description}</p> : null}
  </div>
);
