const API_URL = import.meta.env.VITE_API_URL || "/api";
const API_ORIGIN = API_URL.startsWith("http") ? API_URL.replace(/\/api\/?$/, "") : "";

const request = async (endpoint, options = {}) => {
  const { token, body, headers, ...rest } = options;
  const requestHeaders = new Headers(headers || {});

  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const isFormData = body instanceof FormData;

  if (body && !isFormData) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    headers: requestHeaders,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Request failed.");
  }

  return payload.data;
};

export const resolveAssetUrl = (url) => {
  if (!url) {
    return "";
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return API_ORIGIN ? `${API_ORIGIN}${url}` : url;
};

export const siteApi = {
  getPublicContent: () => request("/content"),
  submitContactMessage: (body) =>
    request("/contact", {
      method: "POST",
      body
    }),
  loginAdmin: (body) =>
    request("/auth/login", {
      method: "POST",
      body
    }),
  getDashboard: (token) =>
    request("/admin/dashboard", {
      method: "GET",
      token
    }),
  uploadAsset: (token, file) => {
    const formData = new FormData();
    formData.append("file", file);

    return request("/admin/uploads", {
      method: "POST",
      token,
      body: formData
    });
  },
  createProgram: (token, body) =>
    request("/admin/programs", {
      method: "POST",
      token,
      body
    }),
  updateProgram: (token, id, body) =>
    request(`/admin/programs/${id}`, {
      method: "PUT",
      token,
      body
    }),
  deleteProgram: (token, id) =>
    request(`/admin/programs/${id}`, {
      method: "DELETE",
      token
    }),
  createStory: (token, body) =>
    request("/admin/stories", {
      method: "POST",
      token,
      body
    }),
  updateStory: (token, id, body) =>
    request(`/admin/stories/${id}`, {
      method: "PUT",
      token,
      body
    }),
  deleteStory: (token, id) =>
    request(`/admin/stories/${id}`, {
      method: "DELETE",
      token
    }),
  createResource: (token, body) =>
    request("/admin/resources", {
      method: "POST",
      token,
      body
    }),
  updateResource: (token, id, body) =>
    request(`/admin/resources/${id}`, {
      method: "PUT",
      token,
      body
    }),
  deleteResource: (token, id) =>
    request(`/admin/resources/${id}`, {
      method: "DELETE",
      token
    }),
  updateMessageStatus: (token, id, status) =>
    request(`/admin/messages/${id}`, {
      method: "PATCH",
      token,
      body: { status }
    })
};
