# Decisiones del proyecto

## TP1 — Git colaborativo

### Estrategia de trabajo

Se utilizó GitHub Flow, trabajando mediante ramas para cada cambio y utilizando Pull Requests antes de integrar modificaciones a la rama `main`.

Se utilizó squash merge para mantener un historial más simple y ordenado.

### Protección de la rama main

Se configuró la rama `main` para impedir pushes directos y exigir que los cambios sean incorporados mediante Pull Requests.

Esto evita modificaciones accidentales y permite revisar los cambios antes de incorporarlos al código principal.

### Resolución del conflicto

El conflicto ocurrió porque dos ramas modificaron de manera diferente la misma línea del archivo `README.md`.

Git no pudo resolverlo automáticamente porque no podía determinar cuál de las dos versiones era la correcta.

El conflicto se resolvió manualmente seleccionando el contenido que debía permanecer.

El conflicto podría haberse evitado coordinando los cambios entre las ramas o modificando partes diferentes del archivo.

### Problemas encontrados

Durante la realización del trabajo aparecieron algunos problemas:

- Un cambio en `README.md` no había sido guardado, por lo que Git mostraba `nothing to commit`.
- Inicialmente las dos ramas utilizaban el mismo cambio, por lo que Git no generaba un conflicto.
- Se realizó accidentalmente un commit local sobre `main`, que se corrigió sincronizando nuevamente la rama con `origin/main`.
- Finalmente se crearon dos ramas desde el mismo punto de partida modificando la misma línea de manera diferente para generar y resolver el conflicto.

### Uso de Inteligencia Artificial

Se utilizó ChatGPT como herramienta de asistencia para interpretar la consigna, comprender los conceptos de Git y GitHub y guiar la ejecución de los procedimientos.

Las respuestas fueron verificadas realizando los comandos directamente y comprobando los resultados obtenidos tanto en Git como en GitHub.

## TP2 — Contenedores

### Aplicación elegida

Se eligió desarrollar un sistema web de control de gastos. La aplicación permite trabajar con un dominio pequeño y entendible, con frontend, API y base de datos, sin desviar el objetivo principal de la materia: construir y justificar una cadena DevOps completa durante el semestre.

La aplicación es un desarrollo individual, puede ejecutarse localmente y tiene un alcance deliberadamente acotado. Su separación en reglas de negocio y acceso a datos permitirá incorporar tests en trabajos posteriores y realizar modificaciones durante la defensa oral.

### Stack inicial

El frontend utiliza JavaScript, React y Vite. El backend utiliza JavaScript, Node.js 22 y Express. Los datos se almacenan en PostgreSQL y se acceden mediante el paquete `pg` y SQL directo, sin ORM.

Utilizar JavaScript en frontend y backend reduce la cantidad de ecosistemas necesarios. PostgreSQL resulta adecuado porque categorías, movimientos y presupuestos poseen relaciones e invariantes claras. Se descartaron TypeScript y un ORM porque agregarían complejidad que no aporta a los objetivos actuales.

### Arquitectura de la aplicación

El backend se organiza como un monolito modular por capas. Cada funcionalidad agrupa Route, Controller, DTO cuando existe una transformación concreta, Service y Repository.

- Route define endpoints.
- Controller traduce entre HTTP y la aplicación.
- DTO selecciona y normaliza los datos que cruzan el límite HTTP.
- Service contiene reglas de negocio.
- Repository concentra el acceso a PostgreSQL y las consultas SQL.

No se agregó una capa DAO porque Repository ya cumple la responsabilidad de acceso a datos. `app.js` configura y exporta Express, mientras que `server.js` es el único archivo que abre el puerto. Esta separación permitirá importar la aplicación desde tests sin ejecutar `listen`.

El manejo de errores se centraliza mediante middlewares. `AppError` representa errores esperados con un estado HTTP concreto y evita repetir la misma traducción en cada Controller.

### Configuración local de PostgreSQL

Durante el desarrollo previo a la contenerización, sólo PostgreSQL 16 se ejecuta en un contenedor temporal basado en `postgres:16-alpine`. Se publica en `localhost:5433` para no modificar ni interferir con la instalación local existente que utiliza el puerto 5432. React/Vite y Node/Express continúan ejecutándose directamente en la máquina.

El volumen `ingsoft3-tp2-db-data` es exclusivamente de desarrollo. No es el volumen definitivo del TP2, no se utilizará como evidencia formal de persistencia y será reemplazado por el volumen declarado en Compose durante la siguiente feature.

### Dominio de movimientos

Los movimientos almacenan descripción, importe, fecha y la referencia a una categoría. No poseen una columna `type`: el tipo se obtiene desde la categoría asociada para evitar dos fuentes de verdad que puedan contradecirse.

Las reglas de descripción, importe, fecha y existencia de la categoría se validan en el Service para devolver errores comprensibles. PostgreSQL refuerza la integridad mediante `NOT NULL`, `CHECK`, `PRIMARY KEY` y `FOREIGN KEY`.

Los importes se almacenan como `NUMERIC(12,2)` y no como tipos de punto flotante. El paquete `pg` devuelve `NUMERIC` como string; por eso `movement.dto.js` lo convierte explícitamente mediante `Number` al construir la respuesta HTTP. No se configuró un parser global oculto.

El Repository devuelve los movimientos junto con `id`, `name` y `type` de su categoría mediante un `JOIN`. Así el frontend recibe una representación completa y no reconstruye relaciones de datos.

### Dockerfiles

El backend utiliza un Dockerfile multi-stage. La etapa `dependencies`, basada en `node:22-alpine`, instala únicamente las dependencias de producción con `npm ci --omit=dev`. La etapa `runtime` copia esas dependencias y el código necesario para ejecutar `src/server.js`, sin conservar archivos del contexto que no forman parte de la aplicación.

La imagen final mantiene Node.js como runtime porque Express necesita ejecutar JavaScript en el servidor. El proceso se ejecuta con el usuario no privilegiado `node`, incluido en la imagen oficial, para evitar que la aplicación se ejecute como root dentro del contenedor.

### Frontend y Nginx

El frontend también utiliza un Dockerfile multi-stage. La primera etapa usa `node:22-alpine` para instalar dependencias y ejecutar el build de Vite. La segunda etapa utiliza `nginx:alpine` y recibe solamente el contenido estático generado en `dist` y la configuración de Nginx. De esta forma, la imagen final no contiene Node.js, las dependencias de desarrollo ni el entorno completo utilizado para compilar.

Nginx sirve el frontend como una SPA y utiliza `try_files` para devolver `index.html` cuando una ruta no corresponde a un archivo estático. Las llamadas del frontend usan rutas relativas `/api`; Nginx las redirige al servicio `backend:3000`. Esto evita incorporar una URL absoluta del backend en el bundle y evita una configuración CORS innecesaria para el navegador.

### Docker Compose

Compose coordina tres servicios: `frontend`, `backend` y `db`. Los contenedores comparten la red creada por Compose y se descubren mediante sus nombres de servicio. Por eso el backend utiliza `DB_HOST=db` y `DB_PORT=5432`, independientemente del puerto utilizado para el desarrollo local fuera de Docker.

PostgreSQL define un healthcheck con `pg_isready`. El backend utiliza `depends_on` con `condition: service_healthy`, por lo que no comienza hasta que la base acepta conexiones. El frontend comienza después del backend.

Las credenciales y el nombre de la base se reciben desde `.env`, que no se versiona. `.env.example` conserva valores de desarrollo reproducibles y no contiene secretos reales.

### Persistencia

El volumen nombrado `db_data` almacena los datos de PostgreSQL fuera del ciclo de vida de los contenedores. `docker compose down` elimina contenedores y red, pero conserva el volumen y los movimientos registrados. `docker compose down -v` elimina también el volumen; en el siguiente inicio, PostgreSQL crea una base nueva y ejecuta nuevamente `database/init.sql`.

### Registry

Se eligió GitHub Container Registry porque el código ya se administra en GitHub y permite publicar las imágenes junto al repositorio. Backend y frontend se publicaron con el tag Docker `v0.1.0`:

- `ghcr.io/figueroamatias/ingsoft3-backend:v0.1.0`
- `ghcr.io/figueroamatias/ingsoft3-frontend:v0.1.0`

El acceso anónimo se verificó cerrando la sesión de GHCR y descargando ambas imágenes nuevamente. `docker-compose.registry.yml` consume esas versiones mediante `image:` en lugar de construirlas mediante `build:`. PostgreSQL continúa utilizando la imagen oficial `postgres:16-alpine`.

### Problemas encontrados

El formulario inicialmente dejaba la fecha vacía. Esto permitía elegir cualquier fecha, pero también facilitaba intentar un envío incompleto. Se resolvió inicializando el campo con la fecha local actual y manteniéndolo editable.

Durante las pruebas, Docker Desktop se encontraba apagado y los comandos no podían conectarse al motor de Docker. Se resolvió iniciando Docker Desktop antes de continuar.

El token utilizado inicialmente para publicar en GHCR no tenía permisos suficientes. Se resolvió generando un Personal Access Token classic con el alcance `write:packages`, autenticando Docker y repitiendo la publicación. Después se ejecutó `docker logout ghcr.io` y se verificó el pull anónimo de ambas imágenes.

### Uso de Inteligencia Artificial

Se utilizó Codex como asistencia para analizar la consigna, proponer la separación en capas, preparar la estructura, definir la contenerización y organizar las verificaciones. Las propuestas se comprobaron ejecutando PostgreSQL, consultando sus datos, probando endpoints, verificando el consumo desde React, construyendo las imágenes, probando persistencia y descargando las imágenes publicadas sin autenticación.
