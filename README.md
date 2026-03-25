# Frontend – Registro de Medidas de Protección

Frontend del sistema **Registro de Medidas de Protección**, desarrollado para ofrecer una interfaz moderna, institucional, responsiva y segura, alineada con la identidad visual de gobierno y orientada a una mejor experiencia de usuario.

---

## Descripción

Este proyecto corresponde al frontend del sistema de **Registro de Medidas de Protección**, cuyo objetivo es facilitar el acceso, consulta y gestión de información dentro de la plataforma, mediante una interfaz clara, actualizada y funcional.

El desarrollo está enfocado en:

- ofrecer una experiencia visual moderna e institucional
- garantizar una navegación clara y responsiva
- integrar autenticación segura con backend
- estructurar el sistema de manera escalable para futuras mejoras

---

## Características principales

- Inicio de sesión conectado a backend real
- Manejo de autenticación con JWT
- Protección de rutas privadas
- Interfaz responsiva para escritorio y móvil
- Diseño institucional con enfoque moderno
- Integración de componentes reutilizables
- Validación visual en flujo de acceso
- Integración de Cloudflare Turnstile en login
- Base preparada para escalabilidad por módulos

---

## Tecnologías utilizadas

- **React**
- **Vite**
- **JavaScript / JSX**
- **Material UI (MUI)**
- **Tailwind CSS**
- **Axios**
- **Notistack**
- **Font Awesome**

---

## Estructura general del proyecto

```bash
src/
├── app/
├── assets/
├── components/
│   ├── layout/
│   ├── security/
│   └── ui/
├── context/
├── pages/
├── router/
├── services/
├── utils/
├── App.jsx
└── main.jsx
