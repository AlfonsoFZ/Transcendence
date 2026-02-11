# 🏓 Transcendence

## ⚠️ Aviso Importante - Versión de Evaluación

Este proyecto ha sido **modificado para la evaluación**. Se han realizado los siguientes cambios:

- **Eliminación de volúmenes Docker**: Los volúmenes han sido comentados en la configuración.
- **Cambios en archivos de configuración**: Varios archivos han sido modificados para adaptarse al entorno de evaluación.

> **Consecuencia**: Los cambios realizados en los archivos del proyecto **no se reflejarán directamente** en los contenedores en ejecución. Para ver cambios, es necesario reconstruir los contenedores.

Si deseas trabajar con **hot-reload** usando `nodemon` o ver el funcionamiento original con volúmenes, consulta una **versión anterior del repositorio**.

---

## 🚀 Requisitos Previos

- Docker y Docker Compose instalados
- Make instalado
- Git (opcional, para clonar el repositorio)

---

## 📋 Pasos para Levantar el Proyecto

### 1. Configurar el archivo `.env`

El proyecto requiere un archivo `.env` en la raíz. Si no existe, el Makefile te pedirá la ruta a uno existente.

#### Variables obligatorias:

```env
# Variable para JWT (generar con: openssl rand -base64 32)
JWT_SECRET="tu_clave_jwt_aqui"

# Variable para sesiones seguras (generar con: openssl rand -base64 32)
SESSION_SECRET="tu_session_secret_aqui"

# Origen de la aplicación
BASE_ORIGIN="https://localhost:8443"

# Prefijo para el CLI del juego (dejar vacío para uso normal)
BACK_PREFIX=""
```

#### Variables opcionales para Google Auth:

Si deseas habilitar el **inicio de sesión con Google**, debes añadir estas variables:

```env
# ID de cliente de Google OAuth
GOOGLE_CLIENT_ID="TU_ID_AQUI.apps.googleusercontent.com"

# Secreto de cliente de Google OAuth
GOOGLE_CLIENT_SECRET="TU_CLIENT_SECRET_AQUI"

# URL de callback para Google Auth
GOOGLE_CALLBACK_URL="https://localhost:8443/back/auth/google/login"
```

> 💡 **Nota**: Si no configuras las variables de Google, el botón "Continue with Google" mostrará un mensaje indicando que es necesario configurar el `.env`.

#### Si quieres generar tus propias claves seguras en Linux:

```bash
# Para JWT_SECRET
openssl rand -base64 32

# Para SESSION_SECRET
openssl rand -base64 32
```

---

### 2. Levantar el proyecto

```bash
make
```

Este comando:
- Verifica si existe el archivo `.env`
- Si no existe, te pedirá la ruta a uno
- Levanta los contenedores con `docker compose up -d`

---

### 3. Acceder a la aplicación

Una vez levantado, accede a:

```
https://localhost:8443
```

> ⚠️ El navegador mostrará una advertencia de certificado SSL. Esto es normal en desarrollo local.

---

## 🔄 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `make` o `make all` | Levanta el proyecto |
| `make down` | Detiene los contenedores |
| `make clean` | Limpia imágenes Docker no utilizadas |
| `make fclean` | Detiene contenedores y limpia imágenes |
| `make purge` | Limpieza completa + elimina la base de datos |
| `make purge-all` | Elimina TODO (incluyendo node_modules y .env) |
| `make re` | Reinicia el proyecto (fclean + all) |
| `make ts` | Compila TypeScript en modo watch |
| `make tailwind` | Compila Tailwind CSS en modo watch |
| `make cli` | Ejecuta el CLI del juego |

---

## ⚠️ Solución de Problemas

### Error en la base de datos

Si experimentas errores relacionados con la base de datos o cambios en los modelos, ejecuta:

```bash
make purge && make
```

Este comando:
1. Detiene los contenedores
2. Limpia las imágenes Docker
3. **Elimina la base de datos SQLite**
4. Vuelve a levantar el proyecto desde cero

> 🔴 **Importante**: Esto eliminará todos los datos almacenados en la base de datos.

---

### Reconstruir después de cambios en el código

Como esta versión no tiene volúmenes, los cambios en el código requieren reconstruir:

```bash
make re
```

O para una limpieza más profunda:

```bash
make purge && make
```

---

## 🔧 Desarrollo con Hot-Reload (Versiones Anteriores)

Esta versión de evaluación **no soporta hot-reload**. Si necesitas esta funcionalidad para desarrollo:

1. Consulta una versión anterior del repositorio con volúmenes habilitados
2. Configura `nodemon` en el backend:
   ```json
   // package.json
   "scripts": {
     "dev": "nodemon index.js"
   }
   ```
3. Asegúrate de que los volúmenes estén configurados en `docker-compose.yml`

---

## 📁 Estructura del Proyecto

```
transcendenceActual/
├── backend/          # API Fastify + WebSockets
│   ├── auth/         # Autenticación JWT y Google
│   ├── config/       # Configuraciones del servidor
│   ├── crud/         # Operaciones CRUD
│   ├── database/     # Modelos, migraciones y seeders
│   ├── game/         # Motor del juego Pong
│   ├── routes/       # Rutas de la API
│   └── websockets/   # Chat, Chess y usuarios online
├── frontend/         # SPA con TypeScript + Tailwind
│   └── src/
│       ├── html/     # Plantillas HTML
│       ├── ts/       # TypeScript
│       └── css/      # Estilos
├── nginx/            # Proxy reverso + SSL
├── docker-compose.yml
├── Makefile
└── .env              # Variables de entorno
```

---

## 👥 Autores

Proyecto desarrollado como parte de nuestra formación en 42
```
imoro-sa · alfofern · fclaus-g · pgomez-r · mbolano-
```

---

## 📝 Notas Adicionales

- El proyecto usa **HTTPS** con certificados autofirmados
- El proyecto usa **HTTPS** con certificados autofirmados
- Las comunicaciones entre frontend y backend se realizan mediante **peticiones HTTP** (GET, POST, PUT, DELETE) y **WebSockets**
- La aplicación corre en **contenedores Docker** orquestados con Docker Compose
- **Nginx** actúa como proxy reverso, manejando HTTPS y enrutando las peticiones
- La base de datos es **SQLite** (archivo local)
- El backend corre en **Fastify** (Node.js)
- El frontend es una **SPA** (Single Page Application) realizado usando **typescript** y **tailwind**
- La base de datos es **SQLite** (archivo local)
- El backend corre en **Fastify** (Node.js)
- El frontend es una **SPA** (Single Page Application) realizado usando **typescript** y **tailwind**

## Archivos test
- El archivo **test_ai_generated.http** ha sido creado solo para probar el código durante la evaluación y poder dar un resultado rápido
- el archivo **test.http** se creó durante el desarrollo para probar los distintos endpoints del backend
- ambos se han usado con extensiones de vcode para llamdas como: **HTTP Client**