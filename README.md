# Ingeniería de Software 3

Sistema web de control de gastos personales desarrollado para los trabajos prácticos de Ingeniería de Software 3 de la UCC.

## Estado actual

El TP1 está terminado. El TP2 se encuentra en desarrollo y actualmente dispone de un walking skeleton que comunica React, Express y PostgreSQL.

## Tecnologías

- Node.js 22 y Express.
- React y Vite.
- PostgreSQL 16.
- JavaScript y SQL directo mediante `pg`.

## Instalación

Esta sección describe la ejecución local de la aplicación previa a su contenerización. Solamente PostgreSQL se ejecuta en un contenedor temporal de desarrollo.

### Requisitos

- Node.js 22 o superior.
- Docker Desktop o Docker Engine.

### 1. Configuración

Desde la raíz del repositorio:

```powershell
Copy-Item .env.example .env
```

### 2. PostgreSQL local de desarrollo

Crear el contenedor y su volumen de desarrollo:

```powershell
docker run -d --name ingsoft3-tp2-db -p 5433:5432 -e POSTGRES_DB=expenses -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -v ingsoft3-tp2-db-data:/var/lib/postgresql/data postgres:16-alpine
```

Aplicar el esquema y los datos semilla:

```powershell
Get-Content -Raw .\database\init.sql | docker exec -i ingsoft3-tp2-db psql -U postgres -d expenses
```

Este volumen es exclusivamente para el desarrollo local de la aplicación. No es el volumen definitivo del TP2 ni constituye evidencia formal de persistencia. Será reemplazado por el volumen declarado en `docker-compose.yml` durante la etapa de contenerización.

### 3. Backend

```powershell
Set-Location backend
npm ci
npm run dev
```

El backend queda disponible en `http://localhost:3000`. Su estado puede consultarse en `http://localhost:3000/health`.

### 4. Frontend

En otra terminal, desde la raíz:

```powershell
Set-Location frontend
npm ci
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.
