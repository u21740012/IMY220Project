export function saveAuth({ user, token }) {
  localStorage.setItem("auth_user", JSON.stringify(user));
  localStorage.setItem("auth_token", token);
}

export function getAuth() {
  const userStr = localStorage.getItem("auth_user");
  const token = localStorage.getItem("auth_token");
  return {
    user: userStr ? JSON.parse(userStr) : null,
    token: token || null,
  };
}

export function clearAuth() {
  localStorage.removeItem("auth_user");
  localStorage.removeItem("auth_token");
}
