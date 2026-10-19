Decisiones del proyecto
TP1 — Git colaborativo
Estrategia de trabajo

Se utilizó GitHub Flow para trabajar con las ramas y pull requestmain.

Protección de main

La rama main se configuró para evitar cambios directos y requerir Pull Requests

Resolución del conflicto

Para demostrar la resolución de conflictos se crearon dos ramas que modificaban de forma diferente la misma parte de README.md.

Git no pudo resolver automáticamente cuál de las dos versiones conservar, por lo que el conflicto se resolvió manualmente antes de continuar con el merge.

Problemas encontrados
Inicialmente algunos cambios no generaban un conflicto real porque las ramas modificaban contenido compatible.
En una prueba se realizó accidentalmente un commit local sobre main, que se corrigió sincronizando nuevamente la rama.
Finalmente se generó el conflicto de forma controlada modificando la misma línea desde dos ramas diferentes.
Uso de Inteligencia Artificial

Se utilizó IA como apoyo para interpretar la consigna y consultar algunos comandos de Git y GitHub.

Los procedimientos se realizaron y verificaron directamente utilizando Git y el repositorio de GitHub.

TP2 — Contenedores
Aplicación y arquitectura

Se eligió desarrollar un sistema web simple de control de gastos, compuesto por frontend, backend y base de datos.

El frontend utiliza React y Vite, el backend Node.js con Express y los datos se almacenan en PostgreSQL.

El backend se organizó por capas:

Route → Controller → DTO → Service → Repository → PostgreSQL

Contenerización

Se crearon Dockerfiles separados para frontend y backend.

El backend utiliza una imagen de Node.js y ejecuta la aplicación con un usuario no privilegiado.

El frontend utiliza un build multi-stage: primero se compila con Node.js y luego los archivos generados son servidos mediante Nginx.

Esto permite que la imagen final del frontend no necesite incluir Node.js ni las dependencias utilizadas durante el desarrollo.

Docker Compose

Docker Compose coordina tres servicios:

frontend
backend
db

Los servicios se comunican mediante la red creada por Compose y utilizan sus nombres de servicio para encontrarse.

PostgreSQL posee un healthcheck y el backend comienza cuando la base de datos está disponible.

Persistencia

Se utilizó un volumen llamado db_data para mantener la información de PostgreSQL aunque se eliminen y vuelvan a crear los contenedores.

Se comprobó que docker compose down conserva los datos y que docker compose down -v elimina también el volumen.

Registry

Las imágenes de backend y frontend se publicaron en GitHub Container Registry.

Se utilizó la versión Docker v0.1.0:

ghcr.io/figueroamatias/ingsoft3-backend:v0.1.0
ghcr.io/figueroamatias/ingsoft3-frontend:v0.1.0

También se creó un Compose alternativo que utiliza estas imágenes publicadas en lugar de construirlas localmente.

Problemas encontrados
El token utilizado inicialmente para publicar en GHCR no tenía los permisos necesarios y se reemplazó por uno con write:packages.
Se verificó posteriormente que las imágenes pudieran descargarse sin una sesión autenticada.
Uso de Inteligencia Artificial

Se utilizó IA como apoyo para revisar la estructura de la aplicación, la configuración de Docker y algunos cambios puntuales de implementación.

Las decisiones finales y el funcionamiento se verificaron ejecutando la aplicación, probando los endpoints, construyendo las imágenes y comprobando la persistencia y la descarga desde GHCR.

TP3 — Planificación y trazabilidad
Sprint

Se definió una duración de 2 semanas por Sprint.

Este período permite trabajar con iteraciones relativamente cortas y mantener un alcance manejable para un proyecto individual.

Límite WIP

Se definió un límite de 2 elementos simultáneos en In Progress.

Es evitar acumular varias tareas abiertas al mismo tiempo y mantener el foco en terminar el trabajo iniciado.

Organización del trabajo

Se utilizó GitHub Projects para organizar el trabajo mediante épicas, historias de usuario y tareas.

Las relaciones entre los elementos se representaron mediante Sub-issues para mantener la trazabilidad entre los distintos niveles.

También se utilizaron iteraciones para organizar las tareas dentro de los Sprints.

Historia de usuario

Se analizó la siguiente historia:

“Como desarrollador quiero crear la tabla usuarios para guardar los datos.”

Se consideró incorrecta porque describe directamente una tarea técnica y no una necesidad del usuario.

Una versión más adecuada sería:

“Como usuario, quiero registrarme en la aplicación para poder guardar y consultar mi información.”

La creación de la tabla de usuarios podría formar parte de las tareas técnicas necesarias para implementar esa historia.

Trazabilidad

Los Pull Requests se vincularon con Issues utilizando referencias como Closes #N.

De esta forma, al completar y mergear un cambio, GitHub puede cerrar automáticamente la tarea relacionada.

Problemas encontrados
Inicialmente fue necesario diferenciar las listas simples del Project de las relaciones reales mediante Sub-issues.
Algunas tareas estaban ubicadas en iteraciones diferentes y se reorganizaron para mantener juntas las tareas pertenecientes a una misma historia.
Se configuró una automatización para mover a Done las Issues cerradas.
Las ramas ya utilizadas se eliminaron después de sus merges para mantener el repositorio ordenado.
Uso de Inteligencia Artificial

Se utilizó IA como apoyo para interpretar la consigna, revisar la organización del Project y asistir en algunos cambios puntuales relacionados con las tareas planificadas.

La trazabilidad, los estados del Project, los Pull Requests y el comportamiento de la aplicación se comprobaron directamente durante el desarrollo.

TP4 — Integración continua
Pipeline de CI

Se utilizó GitHub Actions para implementar la integración continua mediante .github/workflows/ci.yml.

El workflow se ejecuta en Pull Requests hacia main y en pushes realizados sobre esa rama.

Se definieron dos jobs independientes:

build-backend
build-frontend

Como no existe una dependencia entre ellos, ambos pueden ejecutarse en paralelo.

Builds con Docker

Cada job utiliza Docker Buildx y construye la imagen utilizando los mismos Dockerfiles desarrollados en el TP2.

Se decidió reutilizar esos Dockerfiles para mantener una única definición de construcción entre el desarrollo y la integración continua.

En este TP las imágenes se construyen solamente como validación y no se publican en un registry.

Cache

Se configuró cache de capas separado para backend y frontend mediante GitHub Actions Cache.

Su funcionamiento se comprobó realizando una segunda ejecución y observando capas marcadas como CACHED.

Si el cache deja de estar disponible, el pipeline continúa funcionando y simplemente debe volver a construir las capas.

Protección de main

Los checks build-backend y build-frontend se configuraron como obligatorios para poder mergear cambios a main.

Para probar esta protección se introdujo intencionalmente un error de compilación en el frontend.

El pipeline detectó el error y GitHub bloqueó el merge. Luego se corrigió el problema, ambos jobs finalizaron correctamente y el merge volvió a quedar habilitado.

Problemas encontrados
El workflow tuvo que ejecutarse antes de que GitHub permitiera seleccionar sus checks como obligatorios.
Se realizó una segunda ejecución para comprobar la reutilización del cache.
Se introdujo un error controlado en el frontend para verificar que la protección de main funcionara correctamente.
Uso de Inteligencia Artificial

Se utilizó IA como apoyo para interpretar algunos puntos de la consigna y revisar la configuración del workflow.

El comportamiento final se verificó directamente mediante GitHub Actions, sus logs y los Pull Requests.

# TP5 — Calidad automatizada

## Reglas y tests elegidos

Se incorporaron tests unitarios con Vitest y coverage mediante el proveedor V8. En el backend se eligieron reglas donde un error afectaría directamente la integridad de los datos: nombre y tipo de las categorías, duplicados, descripción e importe de los movimientos, validez de la fecha, identificador y existencia de la categoría, y cálculo del resumen financiero. Estas reglas se probaron porque delimitan los valores aceptados por el dominio antes de acceder a PostgreSQL.

Los tests principales del backend comprueban la creación válida de categorías y movimientos, el rechazo de entradas inválidas, la traducción de la restricción única de PostgreSQL a un error 409, la inexistencia de una categoría y el redondeo del saldo. También se probaron DTOs y middlewares de errores. La suite posee 44 casos ejecutados, ampliamente por encima de los 8 requeridos.

El test parametrizado de categorías recorre nombres y tipos inválidos. En movimientos se parametrizaron importes, descripciones, fechas e identificadores de categoría inválidos. Como casos de error se incluyen, entre otros, una fecha imposible como `2026-02-30`, un importe no positivo y una categoría inexistente.

El mock de backend reemplaza los repositorios de categorías y movimientos. Para permitirlo, los Services se refactorizaron mediante las factories `createCategoryService` y `createMovementService`, que reciben sus dependencias. Las exportaciones utilizadas por la aplicación siguen creando esos Services con los repositorios reales, por lo que el comportamiento funcional no cambia.

En el frontend se probaron el cliente HTTP, los formularios, los componentes de presentación y la página principal. El parametrizado verifica los endpoints GET y los envíos POST. Los casos de error comprueban tanto el mensaje entregado por la API como la respuesta sin JSON y los errores mostrados por la página. El mock reemplaza la dependencia real `fetch` y, en las pruebas de `MovementsPage`, el módulo completo del cliente API. La suite posee 21 casos.

## Coverage y quality gate

La primera medición, realizada antes de fijar el umbral, produjo los siguientes resultados:

- Backend: 100% de line coverage y 98,57% de branch coverage.
- Frontend: 100% de line coverage y 100% de branch coverage.

Se eligió un threshold global de 95% tanto para líneas como para ramas. El valor está basado en la medición real: queda por debajo de la cobertura actual para tolerar una variación pequeña, pero lo suficientemente cerca como para que pocas líneas nuevas sin tests vuelvan rojo el pipeline. Se decidió exigir ambas métricas porque el proyecto ya alcanza más de 98% en las dos y las ramas permiten detectar caminos alternativos de condiciones que las líneas por sí solas no distinguen.

En backend el cálculo incluye Services, DTOs, errores y middlewares. Se excluyen `server.js`, `app.js`, configuración de base de datos, Routes, Controllers y Repositories porque son bootstrap, wiring de Express o adaptadores de entrada/salida y persistencia; no se excluyó lógica de negocio. En frontend se excluyen solamente `main.jsx`, que monta React y carga estilos, y `App.jsx`, que únicamente compone `MovementsPage`. La página, los componentes y el cliente API sí forman parte del cálculo.

Un coverage alto no garantiza por sí solo que el software sea correcto. Una línea puede ejecutarse sin comprobar el resultado adecuado, pueden faltar combinaciones de datos y también pueden existir errores de requisitos que ningún porcentaje detecte. Por eso se priorizaron asserts de comportamiento y reglas concretas, no solamente recorrer código.

Se analizó una rama no cubierta en `backend/src/modules/movements/movement.dto.js`, en la condición que decide si `description` es string. La entrada concreta `{ description: 42 }` recorrería el camino faltante. No se agregó un test exclusivo del DTO porque su responsabilidad es conservar ese valor y el Service ya verifica y rechaza descripciones que no son strings; la rama se mantiene visible y no se excluye del cálculo.

Se verificó localmente el gate de backend elevando temporalmente el threshold a 99%: los tests pasaron, pero el comando devolvió error porque el branch coverage era 98,57%. En frontend se ejecutó solamente la suite del cliente API: los tests pasaron, la cobertura cayó a 10,86% de líneas y 10,52% de ramas, y el comando devolvió error frente al threshold de 95%.

## Integración con GitHub Actions

Se extendió `.github/workflows/ci.yml` sin reemplazar el pipeline del TP4. Los jobs obligatorios continúan llamándose `build-backend` y `build-frontend`. Cada uno instala dependencias, ejecuta tests con coverage y aplica el threshold antes de construir la imagen con el Dockerfile del TP2. El resumen de líneas, ramas, funciones y statements se publica en GitHub Actions y cada reporte HTML/LCOV/JSON se guarda como artifact durante 14 días.

## Demostración mediante Pull Requests

- PR con secuencia rojo → corrección → verde → merge: **PENDIENTE — completar URL real**.
- Corrida roja por threshold del PR anterior: **PENDIENTE — completar URL real**.
- Corrida verde con coverage: **PENDIENTE — completar URL real**.
- Segundo PR bloqueado y abierto: **PENDIENTE — completar URL real**.

En el primer PR se deberá agregar código válido sin tests hasta bajar del 95%. El check que corresponda al proyecto modificado (`build-backend` o `build-frontend`) deberá fallar en el paso de coverage y bloquear el merge. Luego se agregarán los tests del código nuevo en la misma rama; al recuperar el threshold, el mismo check quedará verde y se podrá mergear.

En el segundo PR se repetirá un cambio pequeño sin tests. Se registrará aquí su URL y se mantendrá abierto, sin corregir ni mergear, como evidencia del bloqueo real por coverage.

## Problemas encontrados y soluciones

- Vitest 5 quedaba bloqueado al descubrir tests en el entorno local. Se utilizó Vitest 4.1, compatible con Node.js 22 y Vite 8, y se comprobó su funcionamiento en ambos proyectos.
- OneDrive había marcado dependencias del frontend como archivos offline y Node.js esperaba su descarga. Se regeneró `node_modules` mediante `npm ci`; esos archivos son locales, generados y no se versionan.
- El entorno DOM inicial también quedaba bloqueado. Se utilizó `happy-dom`, soportado por Vitest, manteniendo las pruebas de lógica del cliente API independientes del DOM.
- `npm audit` detectó una versión transitiva vulnerable de `proxy-addr` en el backend. Se actualizó el lockfile con `npm audit fix` sin modificar la API ni la arquitectura.

## Uso de Inteligencia Artificial

Se utilizaron ChatGPT y Codex como asistencia para interpretar la consigna, seleccionar reglas de negocio relevantes, diseñar la inyección de dependencias, preparar los tests y configurar coverage, thresholds, resúmenes y artifacts en GitHub Actions.

Las propuestas se verificaron ejecutando las suites y builds reales, midiendo line y branch coverage, forzando fallos controlados del threshold, validando Docker Compose y revisando el workflow y sus resultados. Las URLs de ejecuciones y Pull Requests deberán completarse únicamente después de realizar las demostraciones reales en GitHub.
