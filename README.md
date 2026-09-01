# NomaPay — Frontend

Frontend de **NomaPay**, una aplicación web de billetera digital orientada a ofrecer una experiencia simple, clara y accesible para la gestión financiera desde distintos dispositivos.

Este repositorio contiene exclusivamente la aplicación **Frontend**, desarrollada con **React, TypeScript y Vite**, e integrada con la API REST de NomaPay.

## Desarrolladores Frontend

El desarrollo del frontend fue realizado por:

- **Candela Ferrari**
- **Agustin Spataro**

## Descripción del proyecto

NomaPay busca centralizar en una única interfaz diferentes funcionalidades relacionadas con la administración de una billetera digital.

Desde el frontend, el usuario puede registrarse e iniciar sesión, acceder a su dashboard, consultar información de su billetera y administrar datos de su perfil.

La aplicación fue construida utilizando una arquitectura basada en componentes reutilizables, separación de responsabilidades entre páginas, contextos, hooks y servicios, y una capa centralizada para la comunicación con el backend.

## Tecnologías utilizadas

- **React 19** — construcción de la interfaz de usuario.
- **TypeScript** — tipado estático y mayor mantenibilidad del código.
- **Vite** — entorno de desarrollo y proceso de build.
- **React Router DOM** — navegación y manejo de rutas.
- **Axios** — comunicación con la API REST.
- **Tailwind CSS** — estilos y diseño de la interfaz.
- **Flowbite React** — componentes de interfaz.
- **Google OAuth** — integración del acceso mediante Google.
- **ESLint** — análisis estático y control de calidad del código.
- **Vercel** — despliegue del frontend.

## Funcionalidades implementadas

### Autenticación

- Registro de usuarios.
- Inicio de sesión con email y contraseña.
- Integración de inicio de sesión con Google.
- Persistencia de sesión mediante `localStorage`.
- Manejo de access token y refresh token.
- Cierre de sesión.
- Limpieza de la sesión ante respuestas `401 Unauthorized`.
- Protección de rutas privadas.

### Landing Page

La aplicación incluye una landing page pública compuesta por distintas secciones reutilizables:

- Hero principal.
- Presentación del problema.
- Estadísticas.
- Público objetivo.
- Explicación del funcionamiento.
- Calculadora.
- Sección de confianza.
- Preguntas frecuentes.
- Call to Action.
- Footer.

### Dashboard

Una vez autenticado, el usuario accede al dashboard principal, que incluye:

- Saludo personalizado.
- Visualización del balance.
- Acciones rápidas.
- Tipos de cambio.
- Movimientos recientes.
- Navegación inferior para dispositivos móviles.

### Perfil y configuración

El frontend cuenta con una sección protegida de configuración desde la cual se trabaja con:

- Consulta del perfil del usuario.
- Actualización de datos del perfil.
- Edición de alias.
- Cambio de contraseña.
- Preferencia de moneda.

### Billetera

La capa de servicios incluye integración con el backend para:

- Consultar la billetera del usuario.
- Obtener información financiera asociada.
- Actualizar la moneda preferida.

### Manejo de errores

La aplicación incorpora:

- `ErrorBoundary` para controlar errores inesperados de React.
- Página personalizada `404 - Not Found`.
- Manejo centralizado de errores HTTP mediante Axios.
- Limpieza automática de credenciales locales cuando la API devuelve un estado `401`.

## Arquitectura del proyecto

```text
src/
├── assets/                 # Imágenes, recursos gráficos e iconos
├── components/
│   ├── layout/             # Header y navegación general
│   ├── ui/                 # Componentes visuales reutilizables
│   └── wallet/             # Componentes relacionados con la billetera
├── constants/              # Constantes y datos compartidos
├── context/                # Estado global de autenticación y billetera
├── hooks/                  # Hooks personalizados
│   └── animations/         # Hooks relacionados con animaciones
├── pages/
│   ├── admin/              # Estructura destinada al panel administrativo
│   ├── config/             # Perfil y configuración
│   ├── dashboard/          # Dashboard principal
│   ├── landing/            # Componentes de la Landing Page
│   ├── register/           # Registro
│   └── transfer/           # Estructura destinada a transferencias
├── routes/                 # Rutas y protección de navegación
├── services/               # Comunicación con la API
├── types/                  # Interfaces y tipos TypeScript
├── utils/                  # Funciones auxiliares
├── App.tsx
├── main.tsx
└── index.css
```

## Arquitectura de comunicación con el backend

La comunicación con el backend se encuentra centralizada mediante una instancia de Axios ubicada en:

```text
src/services/api.ts
```

Los servicios relacionados con autenticación, usuario y billetera se encuentran en:

```text
src/services/authService.ts
```

La instancia de Axios utiliza la variable de entorno `VITE_API_URL` como URL base.

Además, antes de realizar una petición autenticada, se recupera el token almacenado localmente y se incorpora al header:

```text
Authorization: Bearer <token>
```

Esto permite mantener separada la lógica de comunicación HTTP de los componentes visuales.

## Rutas principales

| Ruta | Descripción | Acceso |
| --- | --- | --- |
| `/` | Landing Page o Dashboard según la sesión | Público / autenticado |
| `/login` | Inicio de sesión | Público |
| `/register` | Registro de usuario | Público |
| `/profile` | Perfil y configuración | Protegido |
| `*` | Página 404 | Público |

La ruta raíz determina automáticamente qué interfaz mostrar:

- Sin sesión activa → **Landing Page**.
- Con sesión activa → **Splash de bienvenida** y posteriormente **Dashboard**.

## Instalación

### Requisitos previos

Para ejecutar el proyecto es necesario tener instalado:

- **Node.js**
- **npm**
- **Git**

### 1. Clonar el repositorio

```bash
git clone https://github.com/nomapayapp-collab/NomaPay_Frontend.git
```

### 2. Ingresar al proyecto

```bash
cd NomaPay_Frontend
```

### 3. Instalar las dependencias

```bash
npm install
```

Este comando genera nuevamente la carpeta `node_modules` a partir de las dependencias declaradas en `package.json`.

> `node_modules` no debe subirse al repositorio. El proyecto ya la excluye mediante `.gitignore`.

### 4. Configurar las variables de entorno

Crear un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`.

Ejemplo:

```env
VITE_API_URL=URL_DEL_BACKEND
VITE_GOOGLE_CLIENT_ID=GOOGLE_CLIENT_ID
```

Las credenciales y claves privadas no deben incluirse directamente en el repositorio.

### 5. Ejecutar el proyecto

```bash
npm run dev
```

Vite iniciará el servidor de desarrollo y mostrará en la terminal la dirección local de la aplicación, normalmente:

```text
http://localhost:5173/
```

## Scripts disponibles

```bash
npm run dev
```

Inicia el entorno de desarrollo.

```bash
npm run build
```

Compila TypeScript y genera la versión optimizada para producción.

```bash
npm run lint
```

Ejecuta ESLint sobre el proyecto.

```bash
npm run preview
```

Permite visualizar localmente el build de producción.

## Variables de entorno

El proyecto utiliza variables de entorno para evitar incorporar configuraciones sensibles directamente en el código fuente.

El archivo `.env` está excluido de Git mediante `.gitignore`.

El repositorio incluye `.env.example` como referencia para configurar el entorno local.

## Seguridad y manejo de sesión

La autenticación del frontend se administra mediante `AuthContext`.

Al iniciar sesión correctamente, la aplicación almacena la información necesaria para mantener la sesión del usuario.

Las peticiones autenticadas incorporan automáticamente el access token mediante un interceptor de Axios.

Si el servidor devuelve un estado HTTP `401`, la aplicación elimina las credenciales locales para evitar mantener una sesión inválida.

Las rutas que requieren autenticación utilizan `ProtectedRoute`.

> Las variables expuestas mediante el prefijo `VITE_` forman parte del código entregado al navegador. Nunca deben utilizarse para almacenar secretos que deban permanecer exclusivamente en el servidor.

## Diseño responsive

La interfaz fue desarrollada con un enfoque adaptable, priorizando una experiencia clara en dispositivos móviles y manteniendo compatibilidad con resoluciones de escritorio.

El proyecto utiliza componentes reutilizables para mantener consistencia visual entre las distintas pantallas.

## Deploy

El proyecto está preparado para desplegarse como una **Single Page Application (SPA)** en Vercel.

El archivo `vercel.json` incorpora una regla de reescritura hacia `index.html`, permitiendo que React Router gestione correctamente las rutas del lado del cliente.

## Estado del proyecto

NomaPay continúa en desarrollo. Algunas carpetas del repositorio representan funcionalidades previstas o en proceso de implementación, como determinadas secciones administrativas y de transferencias.

El README diferencia estas estructuras de las funcionalidades que actualmente cuentan con implementación en el frontend.

## Autores

**Candela Ferrari**  
Frontend Developer

**Agustin Spataro**  
Frontend Developer

---

### NomaPay

**Tu ruta financiera.**
