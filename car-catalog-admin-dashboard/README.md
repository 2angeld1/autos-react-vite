# 📊 VeloDrive - Admin Dashboard

Panel de administración integral para la gestión de la plataforma VeloDrive. Permite a los administradores controlar inventario, usuarios, promociones y visualizar métricas clave del negocio en tiempo real.

## 🌟 Funcionalidades Clave

*   **Dashboard Interactivo:** 
    *   Visualización de KPIs (Total Autos, Valor Inventario, Leads).
    *   Gráficos de rendimiento y stock.
*   **Gestión de Inventario (CRUD):** 
    *   Creación, edición y eliminación de vehículos.
    *   Subida de imágenes con **Drag & Drop** y previsualización.
*   **Gestión de Promociones:** Control de banners y ofertas activas en el frontend.
*   **Sistema de Archivos:** Explorador de archivos multimedia integrado.
*   **Seguridad:** Rutas protegidas y gestión de sesiones de administrador.

## 🛠️ Stack Tecnológico

*   **Core:** React 18, TypeScript, Vite
*   **UI/UX:** TailwindCSS, Lucide Icons
*   **Gráficos:** Recharts / Chart.js
*   **Formularios:** React Hook Form
*   **Gestión de Archivos:** React Dropzone
*   **HTTP Client:** Axios (con interceptores para Auth)

## 🚀 Puesta en Marcha

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```

2.  **Configurar conexión:**
    Asegúrate de que el `.env` apunte a tu API local o de producción:
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```

3.  **Iniciar panel:**
    ```bash
    npm run dev
    ```

## 📂 Organización de Código

El dashboard está estructurado para facilitar la escalabilidad:

*   `src/pages`: Vistas por módulo (Dashboard, Cars, Users, Settings).
*   `src/components/common`: Componentes base (Botones, Inputs, Modales).
*   `src/components/dashboard`: Componentes específicos de métricas (StatsCard, Charts).
*   `src/layouts`: Layouts principales (Sidebar, Header).
*   `src/services`: Servicios de API tipados.

---
Desarrollado con ❤️ por [Tu Nombre/Usuario]