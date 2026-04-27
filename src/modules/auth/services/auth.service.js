import api from "../../../api/http";
import endpoints from "../../../api/endpoints";

export async function loginRequest({ email, password }) {
  const params = new URLSearchParams();
  params.append("username", email?.trim() || "");
  params.append("password", password || "");

  const response = await api.post(endpoints.auth.login, params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
}

export async function fetchTwoFactorSetupQr({ userId }) {
  const response = await api.post(
    endpoints.auth.setupTwoFactor,
    { user_id: userId },
    {
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "blob",
    }
  );

  return response.data;
}

export async function enableTwoFactorRequest({ userId, code }) {
  const response = await api.post(
    endpoints.auth.enableTwoFactor,
    {
      user_id: userId,
      code,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

export async function verifyTwoFactorRequest({ userId, code }) {
  const response = await api.post(
    endpoints.auth.verifyTwoFactor,
    {
      user_id: userId,
      code,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

export async function getCurrentUserProfile() {
  const response = await api.get(endpoints.auth.me);
  return response.data;
}