const KEY = "gsl_admin_token";

export function setToken(token: string) {
  window.localStorage.setItem(KEY, token);
}

export function clearToken() {
  window.localStorage.removeItem(KEY);
}
