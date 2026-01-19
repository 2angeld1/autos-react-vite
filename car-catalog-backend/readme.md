# 🚀 Car Catalog API (VeloDrive Core)

Back-end robusto y escalable desarrollado para la plataforma VeloDrive. Construido con **Node.js**, **Express**, **TypeScript** y **MongoDB**, siguiendo una arquitectura por capas para garantizar mantenibilidad y escalabilidad.

## ✨ Características Principales

*   **Autenticación Segura:** JWT (JSON Web Tokens) con gestión de roles (Admin/User).
*   **Gestión Multimedia:** Carga de imágenes optimizada compatible con almacenamiento local y en la nube (Cloudinary ready).
*   **Arquitectura Limpia:** Separación de responsabilidades mediante patrón _Controller-Service-Repository_.
*   **Validación de Datos:** Uso estricto de `express-validator` para integridad de datos.
*   **Documentación API:** Integrada con **Swagger/OpenAPI**.
*   **Base de Datos NoSQL:** Esquemas flexibles y potentes con Mongoose.

## 🛠️ Stack Tecnológico

*   **Runtime:** Node.js v18+
*   **Framework:** Express.js
*   **Lenguaje:** TypeScript 5.0
*   **Base de Datos:** MongoDB (via Mongoose)
*   **Documentación:** Swagger UI Express
*   **Seguridad:** Helmet, CORS, Bcrypt

## 📚 Documentación de API

Una vez iniciado el servidor, puedes acceder a la documentación interactiva completa en:

```
http://localhost:5000/api-docs
```

Aquí podrás probar todos los endpoints (Auth, Cars, Users, Uploads) directamente desde el navegador.

## 🚀 Instalación y Uso

1.  **Clonar repositorio:**
    ```bash
    git clone <repo-url>
    cd car-catalog-backend
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar entorno:**
    Crea un archivo `.env` basado en `.env.example`:
    ```env
    PORT=5000
    MONGODB_URI=mongodb+srv://...
    JWT_SECRET=super_secret_key
    FRONTEND_URL=http://localhost:5173
    ```

4.  **Iniciar servidor (Desarrollo):**
    ```bash
    npm run dev
    ```

5.  **Poblar base de datos (Seed):**
    ```bash
    npm run seed
    ```

## 📂 Estructura del Proyecto

```bash
src/
├── config/         # Configuraciones (DB, Swagger, Env)
├── controllers/    # Lógica de entrada/salida (Request/Response)
├── middleware/     # Auth, Validaciones, Error Handling
├── models/         # Esquemas de Mongoose
├── routes/         # Definición de endpoints
├── services/       # Lógica de negocio pura
├── types/          # Definiciones de TypeScript
└── utils/          # Helpers y utilidades
```

## 🧪 Testing

El proyecto está preparado para pruebas unitarias e integración.
```bash
npm test
```

---
Desarrollado con ❤️ por [Tu Nombre/Usuario]
