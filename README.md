# Ingeniería de Software 3

Sistema web de control de gastos desarrollado para los trabajos prácticos de Ingeniería de Software 3 de la UCC.

## Estado actual

El TP1, TP2 y TP3 están terminados. La aplicación permite consultar y crear categorías, listar movimientos, registrar nuevos movimientos y visualizar un resumen financiero mediante el flujo React → Nginx → Express → PostgreSQL.

## Funcionalidad

- Consulta y creación de categorías almacenadas en PostgreSQL.
- Listado de movimientos con su categoría y tipo.
- Registro de movimientos con validaciones de dominio.
- Resumen financiero de ingresos, gastos y saldo.
- Healthcheck del backend y su conexión con PostgreSQL.

## Tecnologías

- Node.js 22 y Express.
- React y Vite.
- Nginx.
- PostgreSQL 16.
- Docker y Docker Compose.

## Requisitos

- Docker Desktop o Docker Engine.
- Docker Compose v2.

Node.js 22 solamente es necesario si se desea ejecutar frontend y backend fuera de Docker.

## Configuración

Crear el archivo local de variables desde la raíz del repositorio:

```bash
cp .env.example .env
```

En PowerShell para Windows, el comando equivalente es:

```powershell
Copy-Item .env.example .env
```

`.env.example` contiene valores exclusivamente de desarrollo y no contiene secretos reales. Para la ejecución local fuera de Docker utiliza PostgreSQL en `localhost:5433`. Dentro de Compose, el backend sobrescribe esa dirección y se conecta mediante `DB_HOST=db` y `DB_PORT=5432`.

## Ejecución mediante build local

Construir las imágenes e iniciar los tres servicios:

```bash
docker compose up -d --build
```

La aplicación queda disponible en:

- Frontend: `http://localhost:3000`.
- Backend: `http://localhost:8080`.
- Healthcheck: `http://localhost:8080/health`.

Endpoints principales:

- `GET /api/categories`
- `POST /api/categories`
- `GET /api/movements`
- `GET /api/movements/summary`
- `POST /api/movements`

### Ver el estado

```bash
docker compose ps
```

El servicio `db` debe aparecer como `healthy`, y `backend` y `frontend` deben estar en ejecución.

### Detener los servicios

```bash
docker compose down
```

Este comando elimina los contenedores y la red, pero conserva el volumen `db_data` y, por lo tanto, los datos de PostgreSQL.

### Reinicializar la base de datos

```bash
docker compose down -v
docker compose up -d --build
```

La opción `-v` elimina también el volumen persistente. En el siguiente inicio se vuelve a ejecutar `database/init.sql`, por lo que los movimientos registrados anteriormente dejan de existir y se recrean las categorías iniciales.

## Ejecución desde GHCR

El Compose de Registry utiliza imágenes publicadas en GitHub Container Registry en lugar de construir frontend y backend localmente:

```bash
docker compose -f docker-compose.registry.yml up -d
```

Imágenes utilizadas:

- `ghcr.io/figueroamatias/ingsoft3-backend:v0.1.0`
- `ghcr.io/figueroamatias/ingsoft3-frontend:v0.1.0`

PostgreSQL continúa utilizando la imagen oficial `postgres:16-alpine` y el volumen persistente `db_data`.

Para comprobar o detener esta variante:

```bash
docker compose -f docker-compose.registry.yml ps
docker compose -f docker-compose.registry.yml down
```

## Desarrollo local fuera de Docker

Para trabajar con React/Vite y Node/Express directamente en la máquina, PostgreSQL puede ejecutarse en un contenedor temporal:

```powershell
docker run -d --name ingsoft3-tp2-db -p 5433:5432 -e POSTGRES_DB=expenses -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -v ingsoft3-tp2-db-data:/var/lib/postgresql/data postgres:16-alpine
Get-Content -Raw .\database\init.sql | docker exec -i ingsoft3-tp2-db psql -U postgres -d expenses
```

Luego se pueden iniciar backend y frontend en terminales separadas:

```powershell
Set-Location backend
npm ci
npm run dev
```

```powershell
Set-Location frontend
npm ci
npm run dev
```

En este modo el backend utiliza `localhost:5433` y el frontend queda disponible en `http://localhost:5173`. El volumen temporal `ingsoft3-tp2-db-data` no es el volumen definitivo ni forma parte de la evidencia formal de persistencia del TP2.
