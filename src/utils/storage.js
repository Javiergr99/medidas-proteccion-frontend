const STORAGE_KEYS = {
  token: "token",
  tokenType: "token_type",
  user: "auth_user",
  rememberedUser: "remember_user",
  pendingTwoFactor: "pending_2fa_challenge",
  postLoginWelcome: "show_post_login_welcome",
};

function safeJsonParse(value, fallback = null) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function getStoredAuthSession() {
  const token = localStorage.getItem(STORAGE_KEYS.token);
  const tokenType = localStorage.getItem(STORAGE_KEYS.tokenType);
  const user = safeJsonParse(localStorage.getItem(STORAGE_KEYS.user), null);

  return {
    token,
    tokenType,
    user,
  };
}

export function persistAuthSession({ token, tokenType, user }) {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.token, token);
  } else {
    localStorage.removeItem(STORAGE_KEYS.token);
  }

  if (tokenType) {
    localStorage.setItem(STORAGE_KEYS.tokenType, tokenType);
  } else {
    localStorage.removeItem(STORAGE_KEYS.tokenType);
  }

  if (user) {
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.user);
  }
}

export function clearAuthSession() {
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.tokenType);
  localStorage.removeItem(STORAGE_KEYS.user);
}

export function getRememberedUser() {
  return localStorage.getItem(STORAGE_KEYS.rememberedUser) || "";
}

export function setRememberedUser(value) {
  const nextValue = value?.trim() || "";

  if (!nextValue) {
    localStorage.removeItem(STORAGE_KEYS.rememberedUser);
    return;
  }

  localStorage.setItem(STORAGE_KEYS.rememberedUser, nextValue);
}

export function clearRememberedUser() {
  localStorage.removeItem(STORAGE_KEYS.rememberedUser);
}

export function getPendingTwoFactorChallenge() {
  return safeJsonParse(
    sessionStorage.getItem(STORAGE_KEYS.pendingTwoFactor),
    null
  );
}

export function persistPendingTwoFactorChallenge(challenge) {
  if (!challenge) {
    sessionStorage.removeItem(STORAGE_KEYS.pendingTwoFactor);
    return;
  }

  sessionStorage.setItem(
    STORAGE_KEYS.pendingTwoFactor,
    JSON.stringify(challenge)
  );
}

export function clearPendingTwoFactorChallenge() {
  sessionStorage.removeItem(STORAGE_KEYS.pendingTwoFactor);
}

export function getPostLoginWelcomeFlag() {
  return sessionStorage.getItem(STORAGE_KEYS.postLoginWelcome) === "1";
}

export function setPostLoginWelcomeFlag(enabled = true) {
  if (enabled) {
    sessionStorage.setItem(STORAGE_KEYS.postLoginWelcome, "1");
    return;
  }

  sessionStorage.removeItem(STORAGE_KEYS.postLoginWelcome);
}

export function clearPostLoginWelcomeFlag() {
  sessionStorage.removeItem(STORAGE_KEYS.postLoginWelcome);
}