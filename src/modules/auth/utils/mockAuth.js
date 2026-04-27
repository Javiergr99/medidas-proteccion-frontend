function getEmailLocalPart(email = "") {
  return email.trim().toLowerCase().split("@")[0] || "usuario";
}

function buildDisplayName(localPart = "") {
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getMockProfileByEmail(email = "") {
  const localPart = getEmailLocalPart(email);

  const profiles = {
    javier: {
      nombre: "Javier",
      rol: "Capturista",
      registros: ["rmh", "rmp"],
    },
    arturo: {
      nombre: "Arturo",
      rol: "Administrador",
      registros: ["rncas", "rmh", "dvf", "rmp"],
    },
    brandon: {
      nombre: "Brandon",
      rol: "Supervisor",
      registros: ["rncas", "dvf"],
    },
    jocelyn: {
      nombre: "Jocelyn",
      rol: "Capturista",
      registros: ["rmp"],
    },
  };

  const profile = profiles[localPart];

  if (profile) {
    return {
      id: 1,
      email: email.trim(),
      ...profile,
    };
  }

  return {
    id: 1,
    nombre: buildDisplayName(localPart) || "Usuario",
    email: email.trim(),
    rol: "Capturista",
    registros: ["rmp"],
  };
}

export function mockLoginRequest({ email, password }) {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      try {
        if (!email?.trim() || !password?.trim()) {
          reject(new Error("Debes capturar correo y contraseña."));
          return;
        }

        resolve({
          access_token: "mock-token-front-only",
          token_type: "bearer",
          user: getMockProfileByEmail(email),
        });
      } catch (error) {
        reject(error);
      }
    }, 500);
  });
}