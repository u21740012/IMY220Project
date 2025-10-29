// frontend/src/utils/api.js
export function saveAuth({ user, token }) {
  if (user) localStorage.setItem("auth_user", JSON.stringify(user));
  if (token) localStorage.setItem("auth_token", token);
}

export function clearAuth() {
  localStorage.removeItem("auth_user");
  localStorage.removeItem("auth_token");
}

export function getAuth() {
  const userStr = localStorage.getItem("auth_user");
  const token = localStorage.getItem("auth_token");
  return { user: userStr ? JSON.parse(userStr) : null, token: token || null };
}

async function request(method, url, body, isFormData = false) {
  const { token } = getAuth();

  let headers;
  if (!isFormData || token) headers = {};

  if (!isFormData) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const options = {
    method,
    body: body
      ? isFormData
        ? body
        : JSON.stringify(body)
      : undefined,
  };

  if (headers) options.headers = headers;

  const res = await fetch(url, options);

  let data = null;
  try {
    data = await res.json();
  } catch (_) {
    data = null;
  }

  if (!res.ok) {
    const msg = (data && data.error) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export const api = {
  get: (url) => request("GET", url),
  post: (url, body, isFormData = false) => request("POST", url, body, isFormData),
  put: (url, body, isFormData = false) => request("PUT", url, body, isFormData),
  delete: (url) => request("DELETE", url),
};

