import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { SectionHeading } from "../components/SectionHeading";
import { siteApi } from "../services/api";

const initialForm = {
  name: "",
  email: "",
  organization: "",
  interestArea: "",
  message: ""
};

export const ContactPage = () => {
  const { source, error: siteError } = useOutletContext();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await siteApi.submitContactMessage(form);
      setSuccessMessage("Your inquiry has been sent successfully.");
      setForm(initialForm);
    } catch (requestError) {
      setErrorMessage(requestError.message || "We could not submit the form right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <section className="page-hero page-hero--contact">
        <div className="container narrow">
          <p className="eyebrow">Contact</p>
          <h1>Invite partners, funders, training organizations, and communities into the conversation.</h1>
          <p>
            The contact flow is already integrated with the backend so inquiries can be reviewed in
            the admin dashboard.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <div>
            <SectionHeading
              eyebrow="Partnership-ready"
              title="Use this space for funding conversations, skilling partnerships, implementation planning, or field coordination."
              description="The backend stores incoming messages in MongoDB, giving your admin team a clean inbox for follow-up."
            />
            {source === "fallback" ? (
              <p className="notice-text">
                The public site is currently showing preview content. Live contact submissions need
                the backend running with Atlas connected.
                {siteError ? ` ${siteError}` : ""}
              </p>
            ) : null}
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              Full name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>
              Email
              <input name="email" type="email" value={form.email} onChange={handleChange} required />
            </label>
            <label>
              Organization
              <input name="organization" value={form.organization} onChange={handleChange} />
            </label>
            <label>
              Interest area
              <input name="interestArea" value={form.interestArea} onChange={handleChange} />
            </label>
            <label>
              Message
              <textarea
                name="message"
                rows="6"
                value={form.message}
                onChange={handleChange}
                required
              />
            </label>
            {successMessage ? <p className="form-success">{successMessage}</p> : null}
            {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
            <button className="button button--primary" disabled={submitting} type="submit">
              {submitting ? "Sending..." : "Send inquiry"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
