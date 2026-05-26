const endpoints = {
  auth: {
    login: "/login",
    me: "/users/me",
    setupTwoFactor: "/setup",
    enableTwoFactor: "/enable",
    verifyTwoFactor: "/login/2fa",
    refresh: "/refresh",
    logout: "/logout",
  },

  users: {
    me: "/users/me",
    list: "/users",
    create: "/users",
    update: (userId) => `/users/${userId}`,
    catalogPermissions: "/users/catalogo-permisos",
  },
};

export default endpoints;