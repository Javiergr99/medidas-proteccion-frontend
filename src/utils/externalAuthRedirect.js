const DEFAULT_LOGIN_UNIVERSAL_URL = "http://localhost:5174/login";
const REDIRECT_CODE_PARAM = "code";

export function getLoginUniversalUrl() {
  return import.meta.env.VITE_LOGIN_UNIVERSAL_URL || DEFAULT_LOGIN_UNIVERSAL_URL;
}

function getCurrentAbsoluteUrl(targetPath = "") {
  if (targetPath && targetPath.startsWith("http")) {
    return targetPath;
  }

  return `${window.location.origin}${targetPath || window.location.pathname}`;
}

function removeRedirectCodeFromUrlObject(url) {
  url.searchParams.delete(REDIRECT_CODE_PARAM);
  return url;
}

export function getExternalRedirectCodeFromUrl() {
  const searchParams = new URLSearchParams(window.location.search || "");
  return searchParams.get(REDIRECT_CODE_PARAM) || "";
}

export function hasExternalRedirectCodeInUrl() {
  return Boolean(getExternalRedirectCodeFromUrl());
}

export function removeExternalRedirectCodeFromUrl() {
  const url = new URL(window.location.href);

  removeRedirectCodeFromUrlObject(url);

  const cleanUrl = `${url.pathname}${url.search}${url.hash}`;

  window.history.replaceState(window.history.state, document.title, cleanUrl);
}

export function getCleanCurrentRedirectUrl(targetPath = "") {
  const currentUrl = new URL(getCurrentAbsoluteUrl(targetPath));

  removeRedirectCodeFromUrlObject(currentUrl);

  currentUrl.hash = "";

  return currentUrl.toString();
}

export function buildLoginUniversalRedirectUrl(targetPath = "") {
  const loginUrl = getLoginUniversalUrl();

  const currentUrl = getCleanCurrentRedirectUrl(targetPath);
  const url = new URL(loginUrl);

  url.searchParams.set("redirect", currentUrl);

  return url.toString();
}

export function redirectToLoginUniversal(targetPath = "") {
  const redirectUrl = buildLoginUniversalRedirectUrl(targetPath);
  window.location.replace(redirectUrl);
}

export function getLoginUniversalRedirectPath(location) {
  const pathname = location?.pathname || window.location.pathname || "/";
  const search = location?.search || window.location.search || "";
  const hash = location?.hash || window.location.hash || "";

  const url = new URL(`${pathname}${search}${hash}`, window.location.origin);

  removeRedirectCodeFromUrlObject(url);

  url.hash = "";

  return `${url.pathname}${url.search}${url.hash}`;
}
