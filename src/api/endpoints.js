const endpoints = {
  auth: {
    /**
     * Paso 1:
     * Valida CURP + contraseña.
     * No devuelve token.
     * Devuelve pending_setup o pending_2fa.
     */
    login: "/login",

    /**
     * Perfil del usuario autenticado.
     * Requiere Authorization Bearer.
     */
    me: "/users/me",

    /**
     * Primera configuración 2FA.
     * Devuelve imagen PNG del QR.
     */
    setupTwoFactor: "/setup",

    /**
     * Activa 2FA por primera vez.
     * Devuelve access_token + refresh_token.
     */
    enableTwoFactor: "/enable",

    /**
     * Verifica 2FA en inicios posteriores.
     * Devuelve access_token + refresh_token.
     */
    verifyTwoFactor: "/login/2fa",

    /**
     * Renueva access_token usando refresh_token rotatorio.
     */
    refresh: "/refresh",

    /**
     * Cierra sesión invalidando refresh_token.
     */
    logout: "/logout",
  },

  users: {
    me: "/users/me",
    list: "/users",
    create: "/users",
    catalogPermissions: "/users/catalogo-permisos",
  },
};

export default endpoints;