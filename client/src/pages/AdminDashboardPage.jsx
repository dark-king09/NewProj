import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AssetUploadField } from "../components/AssetUploadField";
import { LoadingBlock } from "../components/LoadingBlock";
import { useAuth } from "../context/AuthContext";
import { siteApi } from "../services/api";

const dashboardTabs = ["overview", "programs", "stories", "resources", "messages"];

const emptyProgramForm = {
  title: "",
  summary: "",
  description: "",
  location: "",
  audience: "",
  format: "",
  impactMetric: "",
  focusAreas: "",
  imageUrl: "",
  featured: false,
  status: "published"
};

const emptyStoryForm = {
  title: "",
  summary: "",
  storyteller: "",
  location: "",
  quote: "",
  body: "",
  tags: "",
  coverImage: "",
  featured: false,
  status: "published"
};

const emptyResourceForm = {
  title: "",
  summary: "",
  category: "",
  url: "",
  ctaLabel: "",
  imageUrl: "",
  status: "published"
};

const createSummaryCards = (dashboard) => [
  { label: "Programs", value: dashboard.programs.length },
  { label: "Stories", value: dashboard.stories.length },
  { label: "Resources", value: dashboard.resources.length },
  {
    label: "Unread messages",
    value: dashboard.messages.filter((message) => message.status === "unread").length
  }
];

export const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [dashboard, setDashboard] = useState({
    programs: [],
    stories: [],
    resources: [],
    messages: []
  });

  const [editingProgramId, setEditingProgramId] = useState("");
  const [editingStoryId, setEditingStoryId] = useState("");
  const [editingResourceId, setEditingResourceId] = useState("");

  const [programForm, setProgramForm] = useState(emptyProgramForm);
  const [storyForm, setStoryForm] = useState(emptyStoryForm);
  const [resourceForm, setResourceForm] = useState(emptyResourceForm);

  const loadDashboard = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await siteApi.getDashboard(token);
      setDashboard(data);
    } catch (requestError) {
      setErrorMessage(requestError.message || "Could not load dashboard.");

      if (
        requestError.message?.toLowerCase().includes("token") ||
        requestError.message?.toLowerCase().includes("authentication")
      ) {
        logout();
        navigate("/admin/login", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [token]);

  const setFormValue = (setter) => (event) => {
    const { name, value, type, checked } = event.target;
    setter((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const resetProgramForm = () => {
    setEditingProgramId("");
    setProgramForm(emptyProgramForm);
  };

  const resetStoryForm = () => {
    setEditingStoryId("");
    setStoryForm(emptyStoryForm);
  };

  const resetResourceForm = () => {
    setEditingResourceId("");
    setResourceForm(emptyResourceForm);
  };

  const prepareProgramForEdit = (program) => {
    setActiveTab("programs");
    setEditingProgramId(program._id);
    setProgramForm({
      title: program.title,
      summary: program.summary,
      description: program.description,
      location: program.location,
      audience: program.audience,
      format: program.format,
      impactMetric: program.impactMetric,
      focusAreas: (program.focusAreas || []).join(", "),
      imageUrl: program.imageUrl || "",
      featured: Boolean(program.featured),
      status: program.status
    });
  };

  const prepareStoryForEdit = (story) => {
    setActiveTab("stories");
    setEditingStoryId(story._id);
    setStoryForm({
      title: story.title,
      summary: story.summary,
      storyteller: story.storyteller,
      location: story.location,
      quote: story.quote,
      body: story.body,
      tags: (story.tags || []).join(", "),
      coverImage: story.coverImage || "",
      featured: Boolean(story.featured),
      status: story.status
    });
  };

  const prepareResourceForEdit = (resource) => {
    setActiveTab("resources");
    setEditingResourceId(resource._id);
    setResourceForm({
      title: resource.title,
      summary: resource.summary,
      category: resource.category,
      url: resource.url,
      ctaLabel: resource.ctaLabel,
      imageUrl: resource.imageUrl || "",
      status: resource.status
    });
  };

  const handleAction = async (action, successMessage) => {
    setErrorMessage("");
    setStatusMessage("");

    try {
      await action();
      await loadDashboard();
      setStatusMessage(successMessage);
    } catch (requestError) {
      setErrorMessage(requestError.message || "Something went wrong.");
    }
  };

  const handleProgramSubmit = async (event) => {
    event.preventDefault();
    const payload = { ...programForm };

    await handleAction(
      async () => {
        if (editingProgramId) {
          await siteApi.updateProgram(token, editingProgramId, payload);
        } else {
          await siteApi.createProgram(token, payload);
        }
        resetProgramForm();
      },
      editingProgramId ? "Program updated." : "Program created."
    );
  };

  const handleStorySubmit = async (event) => {
    event.preventDefault();
    const payload = { ...storyForm };

    await handleAction(
      async () => {
        if (editingStoryId) {
          await siteApi.updateStory(token, editingStoryId, payload);
        } else {
          await siteApi.createStory(token, payload);
        }
        resetStoryForm();
      },
      editingStoryId ? "Story updated." : "Story created."
    );
  };

  const handleResourceSubmit = async (event) => {
    event.preventDefault();
    const payload = { ...resourceForm };

    await handleAction(
      async () => {
        if (editingResourceId) {
          await siteApi.updateResource(token, editingResourceId, payload);
        } else {
          await siteApi.createResource(token, payload);
        }
        resetResourceForm();
      },
      editingResourceId ? "Resource updated." : "Resource created."
    );
  };

  const handleDelete = async (label, action) => {
    const confirmed = window.confirm(`Delete this ${label}? This cannot be undone.`);

    if (!confirmed) {
      return;
    }

    await handleAction(action, `${label} deleted.`);
  };

  if (loading) {
    return <LoadingBlock message="Opening the admin workspace..." />;
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Admin dashboard</p>
          <h1>Content operations for your rural education and skill development platform.</h1>
          <p>
            Signed in as {user?.name} ({user?.email})
          </p>
        </div>
        <div className="admin-header__actions">
          <button className="button button--secondary" type="button" onClick={() => navigate("/")}>
            View website
          </button>
          <button
            className="button button--ghost"
            type="button"
            onClick={() => {
              logout();
              navigate("/admin/login", { replace: true });
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      <section className="admin-summary-grid">
        {createSummaryCards(dashboard).map((card) => (
          <article key={card.label} className="stat-card stat-card--admin">
            <strong>{card.value}</strong>
            <span>{card.label}</span>
          </article>
        ))}
      </section>

      <section className="admin-tabs">
        {dashboardTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? "is-active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </section>

      {statusMessage ? <p className="form-success">{statusMessage}</p> : null}
      {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

      {activeTab === "overview" ? (
        <section className="admin-panel">
          <div className="admin-overview-grid">
            <article className="admin-overview-card">
              <h2>Publishing flow</h2>
              <p>
                Create or update programs, stories, and resources. Published items for learning and
                skilling go live on the public site immediately.
              </p>
            </article>
            <article className="admin-overview-card">
              <h2>Admin-only uploads</h2>
              <p>
                Resource and media uploads are protected by JWT authorization and only available
                inside this dashboard.
              </p>
            </article>
            <article className="admin-overview-card">
              <h2>Inquiry inbox</h2>
              <p>
                Contact form submissions are stored in MongoDB and can be reviewed here without
                leaving the platform.
              </p>
            </article>
          </div>
        </section>
      ) : null}

      {activeTab === "programs" ? (
        <section className="admin-panel admin-panel--split">
          <form className="admin-form" onSubmit={handleProgramSubmit}>
            <div className="admin-form__header">
              <h2>{editingProgramId ? "Edit program" : "Add new program"}</h2>
              {editingProgramId ? (
                <button className="button button--ghost" type="button" onClick={resetProgramForm}>
                  Cancel edit
                </button>
              ) : null}
            </div>
            <label>
              Title
              <input name="title" value={programForm.title} onChange={setFormValue(setProgramForm)} required />
            </label>
            <label>
              Summary
              <textarea
                name="summary"
                rows="3"
                value={programForm.summary}
                onChange={setFormValue(setProgramForm)}
                required
              />
            </label>
            <label>
              Description
              <textarea
                name="description"
                rows="5"
                value={programForm.description}
                onChange={setFormValue(setProgramForm)}
                required
              />
            </label>
            <div className="admin-form__grid">
              <label>
                Location
                <input name="location" value={programForm.location} onChange={setFormValue(setProgramForm)} required />
              </label>
              <label>
                Audience
                <input name="audience" value={programForm.audience} onChange={setFormValue(setProgramForm)} required />
              </label>
              <label>
                Format
                <input name="format" value={programForm.format} onChange={setFormValue(setProgramForm)} required />
              </label>
              <label>
                Impact metric
                <input
                  name="impactMetric"
                  value={programForm.impactMetric}
                  onChange={setFormValue(setProgramForm)}
                  required
                />
              </label>
            </div>
            <label>
              Focus areas
              <input
                name="focusAreas"
                value={programForm.focusAreas}
                onChange={setFormValue(setProgramForm)}
                placeholder="Foundational literacy, STEM exposure, Family engagement"
              />
            </label>
            <AssetUploadField
              token={token}
              label="Program image"
              value={programForm.imageUrl}
              onUploaded={(url) => setProgramForm((current) => ({ ...current, imageUrl: url }))}
            />
            <div className="admin-form__grid admin-form__grid--compact">
              <label>
                Status
                <select name="status" value={programForm.status} onChange={setFormValue(setProgramForm)}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </label>
              <label className="checkbox-field">
                <input
                  name="featured"
                  type="checkbox"
                  checked={programForm.featured}
                  onChange={setFormValue(setProgramForm)}
                />
                Feature on site
              </label>
            </div>
            <button className="button button--primary" type="submit">
              {editingProgramId ? "Save changes" : "Create program"}
            </button>
          </form>

          <div className="admin-list">
            <h2>Existing programs</h2>
            {dashboard.programs.map((program) => (
              <article key={program._id} className="admin-list-item">
                <div>
                  <strong>{program.title}</strong>
                  <p>{program.summary}</p>
                  <span>
                    {program.status} / {program.location}
                  </span>
                </div>
                <div className="admin-list-item__actions">
                  <button type="button" onClick={() => prepareProgramForEdit(program)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleDelete("program", () => siteApi.deleteProgram(token, program._id))
                    }
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === "stories" ? (
        <section className="admin-panel admin-panel--split">
          <form className="admin-form" onSubmit={handleStorySubmit}>
            <div className="admin-form__header">
              <h2>{editingStoryId ? "Edit story" : "Add new story"}</h2>
              {editingStoryId ? (
                <button className="button button--ghost" type="button" onClick={resetStoryForm}>
                  Cancel edit
                </button>
              ) : null}
            </div>
            <label>
              Title
              <input name="title" value={storyForm.title} onChange={setFormValue(setStoryForm)} required />
            </label>
            <label>
              Summary
              <textarea
                name="summary"
                rows="3"
                value={storyForm.summary}
                onChange={setFormValue(setStoryForm)}
                required
              />
            </label>
            <div className="admin-form__grid">
              <label>
                Storyteller
                <input
                  name="storyteller"
                  value={storyForm.storyteller}
                  onChange={setFormValue(setStoryForm)}
                  required
                />
              </label>
              <label>
                Location
                <input name="location" value={storyForm.location} onChange={setFormValue(setStoryForm)} required />
              </label>
            </div>
            <label>
              Quote
              <textarea
                name="quote"
                rows="3"
                value={storyForm.quote}
                onChange={setFormValue(setStoryForm)}
                required
              />
            </label>
            <label>
              Story body
              <textarea
                name="body"
                rows="6"
                value={storyForm.body}
                onChange={setFormValue(setStoryForm)}
                required
              />
            </label>
            <label>
              Tags
              <input
                name="tags"
                value={storyForm.tags}
                onChange={setFormValue(setStoryForm)}
                placeholder="Literacy, Community"
              />
            </label>
            <AssetUploadField
              token={token}
              label="Story cover image"
              value={storyForm.coverImage}
              onUploaded={(url) => setStoryForm((current) => ({ ...current, coverImage: url }))}
            />
            <div className="admin-form__grid admin-form__grid--compact">
              <label>
                Status
                <select name="status" value={storyForm.status} onChange={setFormValue(setStoryForm)}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </label>
              <label className="checkbox-field">
                <input
                  name="featured"
                  type="checkbox"
                  checked={storyForm.featured}
                  onChange={setFormValue(setStoryForm)}
                />
                Feature on site
              </label>
            </div>
            <button className="button button--primary" type="submit">
              {editingStoryId ? "Save changes" : "Create story"}
            </button>
          </form>

          <div className="admin-list">
            <h2>Existing stories</h2>
            {dashboard.stories.map((story) => (
              <article key={story._id} className="admin-list-item">
                <div>
                  <strong>{story.title}</strong>
                  <p>{story.summary}</p>
                  <span>
                    {story.status} / {story.location}
                  </span>
                </div>
                <div className="admin-list-item__actions">
                  <button type="button" onClick={() => prepareStoryForEdit(story)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleDelete("story", () => siteApi.deleteStory(token, story._id))
                    }
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === "resources" ? (
        <section className="admin-panel admin-panel--split">
          <form className="admin-form" onSubmit={handleResourceSubmit}>
            <div className="admin-form__header">
              <h2>{editingResourceId ? "Edit resource" : "Add new resource"}</h2>
              {editingResourceId ? (
                <button className="button button--ghost" type="button" onClick={resetResourceForm}>
                  Cancel edit
                </button>
              ) : null}
            </div>
            <label>
              Title
              <input
                name="title"
                value={resourceForm.title}
                onChange={setFormValue(setResourceForm)}
                required
              />
            </label>
            <label>
              Summary
              <textarea
                name="summary"
                rows="4"
                value={resourceForm.summary}
                onChange={setFormValue(setResourceForm)}
                required
              />
            </label>
            <div className="admin-form__grid">
              <label>
                Category
                <input
                  name="category"
                  value={resourceForm.category}
                  onChange={setFormValue(setResourceForm)}
                  required
                />
              </label>
              <label>
                Call-to-action label
                <input
                  name="ctaLabel"
                  value={resourceForm.ctaLabel}
                  onChange={setFormValue(setResourceForm)}
                  required
                />
              </label>
            </div>
            <label>
              Resource URL or uploaded file path
              <input name="url" value={resourceForm.url} onChange={setFormValue(setResourceForm)} required />
            </label>
            <AssetUploadField
              token={token}
              label="Resource file"
              value={resourceForm.url}
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              helperText="Upload a PDF, PowerPoint, or Word file and this field will be filled automatically."
              onUploaded={(url) => setResourceForm((current) => ({ ...current, url }))}
            />
            <AssetUploadField
              token={token}
              label="Resource image"
              value={resourceForm.imageUrl}
              accept="image/*"
              helperText="Optional cover image for the public resource card."
              onUploaded={(url) => setResourceForm((current) => ({ ...current, imageUrl: url }))}
            />
            <label>
              Status
              <select name="status" value={resourceForm.status} onChange={setFormValue(setResourceForm)}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </label>
            <button className="button button--primary" type="submit">
              {editingResourceId ? "Save changes" : "Create resource"}
            </button>
          </form>

          <div className="admin-list">
            <h2>Existing resources</h2>
            {dashboard.resources.map((resource) => (
              <article key={resource._id} className="admin-list-item">
                <div>
                  <strong>{resource.title}</strong>
                  <p>{resource.summary}</p>
                  <span>
                    {resource.status} / {resource.category}
                  </span>
                </div>
                <div className="admin-list-item__actions">
                  <button type="button" onClick={() => prepareResourceForEdit(resource)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleDelete("resource", () => siteApi.deleteResource(token, resource._id))
                    }
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === "messages" ? (
        <section className="admin-panel">
          <h2>Contact messages</h2>
          <div className="admin-list">
            {dashboard.messages.length === 0 ? (
              <p className="notice-text">No messages yet.</p>
            ) : null}
            {dashboard.messages.map((message) => (
              <article key={message._id} className="admin-list-item admin-list-item--message">
                <div>
                  <strong>{message.name}</strong>
                  <p>{message.message}</p>
                  <span>
                    {message.email}
                    {message.organization ? ` / ${message.organization}` : ""}
                    {message.interestArea ? ` / ${message.interestArea}` : ""}
                  </span>
                </div>
                <div className="message-status-group">
                  <select
                    value={message.status}
                    onChange={(event) =>
                      handleAction(
                        () => siteApi.updateMessageStatus(token, message._id, event.target.value),
                        "Message status updated."
                      )
                    }
                  >
                    <option value="unread">Unread</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
};
