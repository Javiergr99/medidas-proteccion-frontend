import { persistAuthSession } from "./storage";

const DEFAULT_LOGIN_UNIVERSAL_URL = "http://localhost:5174/login";
const AUTH_BRIDGE_PARAM =
  import.meta.env.VITE_AUTH_BRIDGE_PARAM || "auth_bridge";
const AUTH_BRIDGE_MAX_AGE_MS = 2 * 60 * 1000;

export function getLoginUniversalUrl() {
  return import.meta.env.VITE_LOGIN_UNIVERSAL_URL || DEFAULT_LOGIN_UNIVERSAL_URL;
}

function decodeBase64Url(value) {
  const base64 = String(value || "")
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const paddedBase64 = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "="
  );

  const binaryValue = window.atob(paddedBase64);
  const bytes = Uint8Array.from(binaryValue, (char) => char.charCodeAt(0));

  return JSON.parse(new TextDecoder().decode(bytes));
}

function getCurrentAbsoluteUrl(targetPath = "") {
  if (targetPath && targetPath.startsWith("http")) {
    return targetPath;
  }

  return `${window.location.origin}${targetPath || window.location.pathname}`;
}

function removeAuthBridgeFromUrl() {
  const hashValue = window.location.hash?.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash || "";

  if (!hashValue) return;

  const hashParams = new URLSearchParams(hashValue);

  if (!hashParams.has(AUTH_BRIDGE_PARAM)) return;

  hashParams.delete(AUTH_BRIDGE_PARAM);

  const nextHash = hashParams.toString();
  const cleanUrl = `${window.location.pathname}${window.location.search}${
    nextHash ? `#${nextHash}` : ""
  }`;

  window.history.replaceState(window.history.state, document.title, cleanUrl);
}

function getAuthBridgePayloadFromUrl() {
  const hashValue = window.location.hash?.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash || "";

  if (!hashValue) return null;

  const hashParams = new URLSearchParams(hashValue);
  const encodedPayload = hashParams.get(AUTH_BRIDGE_PARAM);

  if (!encodedPayload) {
    return null;
  }

  try {
    return decodeBase64Url(encodedPayload);
  } catch (error) {
    console.warn("No fue posible leer la sesión recibida del login:", error);
    return null;
  }
}

function isValidAuthBridgePayload(payload) {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  if (!payload.token) {
    return false;
  }

  const issuedAt = Number(payload.issuedAt);

  if (!Number.isFinite(issuedAt)) {
    return false;
  }

  return Date.now() - issuedAt <= AUTH_BRIDGE_MAX_AGE_MS;
}

export function consumeExternalAuthSessionFromUrl() {
  const payload = getAuthBridgePayloadFromUrl();

  if (!payload) {
    return null;
  }

  removeAuthBridgeFromUrl();

  if (!isValidAuthBridgePayload(payload)) {
    return null;
  }

  const session = {
    token: payload.token,
    refreshToken: payload.refreshToken || null,
    tokenType: payload.tokenType || "bearer",
    user: payload.user || null,
  };

  persistAuthSession(session);

  return session;
}

export function buildLoginUniversalRedirectUrl(targetPath = "") {
  const loginUrl = getLoginUniversalUrl();

  const currentUrl = getCurrentAbsoluteUrl(targetPath);
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

  return `${pathname}${search}${hash}`;
}