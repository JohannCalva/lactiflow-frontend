# LactiFlow - Frontend

Panel de administración tipo SPA (Single Page Application) desarrollado para gestionar el inventario, catálogo, clientes y entregas de una fábrica de lácteos. Este proyecto consume la API de `lactiflow-server`.

## 🛠 Tecnologías Usadas

- **Frontend:** React 18 + Vite
- **Routing:** React Router DOM
- **UI:** Bootstrap + React Bootstrap
- **Cliente HTTP:** Axios
- **Autenticación:** JWT (JSON Web Tokens) guardado en `localStorage`
- **Deploy:** Vercel

## 📋 Requisitos Previos

Asegúrate de tener instalados:
- [Node.js](https://nodejs.org/) (versión 16+ recomendada)
- [NPM](https://www.npmjs.com/) (generalmente incluido con Node.js)

## ⚙️ Instalación y Configuración Local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/JohannCalva/lactiflow-frontend
   cd lactiflow-frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Levanta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 🔐 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto y agrega la URL base del backend:

```env
VITE_API_URL=http://localhost:3000/api
```

## 📂 Estructura del Proyecto

```text
src/
├── api/          # Configuración de Axios e interceptores (manejo de tokens)
├── assets/       # Estilos globales y recursos estáticos
├── components/   # Componentes reutilizables (Sidebar, Navbar, Modales, DataTable)
├── context/      # Contexto global (AuthContext para estado de sesión)
├── pages/        # Vistas completas de la aplicación (Login, Modulos CRUD)
└── services/     # Funciones HTTP para consumir los endpoints REST
```

## 🛡️ Roles y Permisos

El frontend protege las rutas y muestra u oculta módulos basándose en roles:
- **Admin (Administrador):** Acceso total al sistema. Puede gestionar Tipos de Negocio, Clientes, Productos, Usuarios y Entregas.
- **Emprendedor:** Acceso restringido. Únicamente puede interactuar con el Dashboard y el módulo de Entregas.

## 🔗 Enlaces Relacionados

- **Repositorio del Backend:** [https://github.com/JohannCalva/lactiflow-backend](https://github.com/JohannCalva/lactiflow-backend)
