const loginUniversalUrl =
  import.meta.env.VITE_LOGIN_UNIVERSAL_URL || "http://localhost:5174/login";

function buildLoginUniversalPath(path = "") {
  try {
    const url = new URL(loginUniversalUrl);
    return `${url.origin}${path}`;
  } catch {
    return `http://localhost:5174${path}`;
  }
}

const routes = {
  root: "/",
  catalogos: "/catalogos",
  medidas: "/medidas",
  medidasNuevo: "/medidas/nuevo",

  /**
   * URLs externas del Login Universal.
   * MP ya no maneja login, dashboard ni perfil de forma interna.
   */
  loginUniversal: loginUniversalUrl,
  loginUniversalDashboard:
    import.meta.env.VITE_LOGIN_UNIVERSAL_DASHBOARD_URL ||
    buildLoginUniversalPath("/dashboard"),
  loginUniversalProfile:
    import.meta.env.VITE_LOGIN_UNIVERSAL_PROFILE_URL ||
    buildLoginUniversalPath("/perfil"),
  loginUniversalLogout:
    import.meta.env.VITE_LOGIN_UNIVERSAL_LOGOUT_URL ||
    buildLoginUniversalPath("/login?logout=1"),
};

export default routes;