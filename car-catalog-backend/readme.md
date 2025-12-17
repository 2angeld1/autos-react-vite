# Backend - Catálogo de Autos

API REST construida con Node.js, Express, TypeScript y Prisma para PostgreSQL.

## 🚀 Características

- Autenticación JWT
- Gestión de usuarios y roles
- Catálogo de autos con filtros avanzados
- Sistema de archivos para imágenes
- Migración completa de MongoDB a PostgreSQL con Prisma
- Desplegado en Render

## 📋 Prerrequisitos

- Node.js 18+
- PostgreSQL (local o en la nube)
- npm o yarn

## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone <tu-repo>
cd car-catalog-backend
```

2. Instala dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones.

## ⚙️ Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NODE_ENV` | Entorno de ejecución | `development` |
| `PORT` | Puerto del servidor | `5000` |
| `DATABASE_URL` | URL de conexión PostgreSQL | `postgresql://user:pass@host/db` |
| `JWT_SECRET` | Clave secreta para JWT | `tu-clave-secreta` |
| `JWT_EXPIRES_IN` | Expiración del token | `7d` |
| `FRONTEND_URL` | URL del frontend desplegado | `https://tu-frontend.vercel.app` |

## 🗄️ Base de Datos

### Configuración de Prisma

1. Instala Prisma CLI (si no está instalado):
```bash
npm install -g prisma
```

2. Ejecuta las migraciones:
```bash
npx prisma migrate dev
```

3. Genera el cliente:
```bash
npx prisma generate
```

### Migración de datos (opcional)

Si tienes datos en MongoDB que quieres migrar:
```bash
npm run migrate:cars
```

## 🚀 Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm start
```

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrarse
- `GET /api/auth/profile` - Obtener perfil

### Autos
- `GET /api/cars` - Listar autos (con filtros)
- `GET /api/cars/:id` - Obtener auto por ID
- `POST /api/cars` - Crear auto (admin)
- `PUT /api/cars/:id` - Actualizar auto (admin)
- `DELETE /api/cars/:id` - Eliminar auto (admin)

### Usuarios (Admin)
- `GET /api/users` - Listar usuarios
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Archivos
- `POST /api/files/upload` - Subir imagen
- `GET /api/files/:filename` - Obtener imagen

## 🚀 Despliegue en Render

1. **Crear cuenta en Render**: Ve a [render.com](https://render.com)

2. **Conectar repositorio**: Conecta tu repositorio de GitHub

3. **Configurar servicio**:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`

4. **Variables de entorno**: Agrega todas las variables del `.env`

5. **Base de datos**: Crea una PostgreSQL database en Render y conecta

6. **Desplegar**: Render construirá y desplegará automáticamente

## 🔗 Conexión con Frontend

### Dashboard Admin (Vercel)
- URL: `https://tu-dashboard.vercel.app`
- API Base: `https://tu-backend.onrender.com/api`

### Frontend Principal (Vercel)
- URL: `https://tu-frontend.vercel.app`
- API Base: `https://tu-backend.onrender.com/api`

## 📝 Scripts Disponibles

```bash
npm run dev          # Desarrollo con nodemon
npm run build        # Compilar TypeScript
npm start           # Ejecutar en producción
npm run migrate     # Ejecutar migraciones Prisma
npm run seed        # Poblar base de datos
npm run test        # Ejecutar tests
```

## 🧪 Testing

```bash
npm test
```

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── controllers/    # Controladores de rutas
│   ├── middleware/     # Middleware personalizado
│   ├── models/         # Modelos de Prisma (opcional)
│   ├── routes/         # Definición de rutas
│   ├── services/       # Lógica de negocio
│   ├── types/          # Tipos TypeScript
│   ├── utils/          # Utilidades
│   ├── config/         # Configuración
│   └── server.ts       # Punto de entrada
├── prisma/
│   ├── schema.prisma   # Esquema de base de datos
│   └── migrations/     # Migraciones
├── uploads/            # Archivos subidos
└── logs/              # Logs de aplicación
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
