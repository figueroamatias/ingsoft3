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

- PR con secuencia rojo → corrección → verde → merge: https://github.com/figueroamatias/ingsoft3/pull/32.
- Corrida roja por threshold del PR anterior: https://github.com/figueroamatias/ingsoft3/actions/runs/39360939173.
- Corrida verde con coverage: https://github.com/figueroamatias/ingsoft3/actions/runs/39361181199.
- Segundo PR bloqueado y abierto: https://github.com/figueroamatias/ingsoft3/pull/33.
- Corrida roja del segundo PR: https://github.com/figueroamatias/ingsoft3/actions/runs/39361360251.

En el primer PR se agregó código válido sin tests. Los 21 tests existentes pasaron, pero `build-frontend` falló en el paso de coverage porque las líneas bajaron a 94,84%, por debajo del threshold global de 95%; por ese motivo el merge quedó bloqueado aunque el código compilaba. Luego se agregaron tres casos para el código nuevo en la misma rama. La cobertura volvió a 100% en líneas y ramas, los checks quedaron verdes y el PR se pudo mergear.

En el segundo PR se agregó otro cambio pequeño sin tests. Los 24 tests existentes pasan y el código compila, pero `build-frontend` falla porque la cobertura queda en 92,38% de líneas y 86,95% de ramas. El PR permanece abierto, rojo, bloqueado y sin mergear como evidencia del quality gate.

## Problemas encontrados y soluciones

- Vitest 5 quedaba bloqueado al descubrir tests en el entorno local. Se utilizó Vitest 4.1, compatible con Node.js 22 y Vite 8, y se comprobó su funcionamiento en ambos proyectos.
- OneDrive había marcado dependencias del frontend como archivos offline y Node.js esperaba su descarga. Se regeneró `node_modules` mediante `npm ci`; esos archivos son locales, generados y no se versionan.
- El entorno DOM inicial también quedaba bloqueado. Se utilizó `happy-dom`, soportado por Vitest, manteniendo las pruebas de lógica del cliente API independientes del DOM.
- `npm audit` detectó una versión transitiva vulnerable de `proxy-addr` en el backend. Se actualizó el lockfile con `npm audit fix` sin modificar la API ni la arquitectura.

## Uso de Inteligencia Artificial

Se utilizaron ChatGPT y Codex como asistencia para interpretar la consigna, seleccionar reglas de negocio relevantes, diseñar la inyección de dependencias, preparar los tests y configurar coverage, thresholds, resúmenes y artifacts en GitHub Actions.

Las propuestas se verificaron ejecutando las suites y builds reales, midiendo line y branch coverage, forzando fallos controlados del threshold, validando Docker Compose y revisando el workflow, los Pull Requests y las ejecuciones reales enlazadas en esta sección.

# TP6 — Continuous Delivery

## Estado inicial y proveedor

La aplicación parte de React/Vite servido por Nginx, Express sobre Node.js 22 y PostgreSQL 16. Los Dockerfiles de backend y frontend, los tests, el threshold global de 95%, los jobs obligatorios `build-backend` y `build-frontend`, GHCR y la Release `v5.0.0` ya existían antes de TP6. No existía infraestructura externa para QA o producción ni GitHub Environments configurados.

Se eligió Render como proveedor propuesto porque permite ejecutar imágenes públicas de GHCR, utilizar deploy hooks, exponer servicios web y conectar PostgreSQL administrado. La conexión disponible de Render requiere reautenticación, por lo que todavía no se crearon servicios ni bases y no se presenta ningún deploy como realizado. Además, Render permite una sola base PostgreSQL gratuita por workspace y esa base vence a los 30 días; para mantener QA y producción aislados en el mismo workspace se necesitan dos bases pagas o una decisión explícita sobre otro proveedor.

En GitHub se crearon los Environments `qa` y `production`. `production` tiene como required reviewer a `figueroamatias`, con autoaprobación permitida porque el proyecto es individual. Ambos Environments aceptan deployments solamente desde ramas protegidas. También se restauraron `build-backend` y `build-frontend` como required checks de `main`, ya que la auditoría encontró que la protección existía pero su lista de checks estaba vacía.

## Arquitectura prevista

QA estará formado por un frontend, un backend y una base PostgreSQL exclusivos. Producción tendrá otros tres recursos independientes. El frontend QA apuntará únicamente al backend QA, y este utilizará solamente la base QA. La misma separación se aplicará en producción. Las dos bases no compartirán credenciales, host ni datos.

Los cuatro servicios web se crearán como servicios basados en imágenes públicas de GHCR, con el auto-deploy de Render desactivado. El pipeline será el único responsable de solicitar despliegues. Esta estrategia permite promover exactamente la misma imagen verificada, no sólo el mismo commit.

## Artefactos y trazabilidad

Después de que ambos jobs de TP5 hayan pasado tests, coverage, quality gates y build, `publish-backend` y `publish-frontend` construyen y publican:

- `ghcr.io/figueroamatias/ingsoft3-backend:<GITHUB_SHA>`
- `ghcr.io/figueroamatias/ingsoft3-frontend:<GITHUB_SHA>`

El SHA completo es una etiqueta inmutable y también se incorpora como label OCI y como `APP_VERSION` dentro de cada imagen. No se utiliza `latest` como fuente de verdad. Los Pull Requests ejecutan CI, pero no publican ni despliegan.

Paquetes públicos existentes:

- Backend: https://github.com/users/figueroamatias/packages/container/package/ingsoft3-backend
- Frontend: https://github.com/users/figueroamatias/packages/container/package/ingsoft3-frontend

PENDIENTE: agregar la URL de la corrida de `main` que publique las primeras imágenes identificadas por SHA.

## Configuración por entorno

La imagen del frontend utiliza el template de Nginx en tiempo de arranque. `BACKEND_URL` se reemplaza mediante `envsubst`, por lo que la misma imagen puede apuntar al backend QA o al backend de producción sin recompilarse. `/version` devuelve el `APP_VERSION` de la imagen. El backend incluye el mismo valor en `/health`, que además ejecuta una consulta real a PostgreSQL.

Cada GitHub Environment debe contener, sin exponer sus valores:

- secrets `BACKEND_DEPLOY_HOOK` y `FRONTEND_DEPLOY_HOOK`;
- variables `BACKEND_URL` y `FRONTEND_URL`.

La variable de repositorio `CD_ENABLED` quedó en `false` hasta que los seis recursos externos estén operativos. Sólo después de verificar hooks, URLs y bases deberá cambiarse a `true`.

## Flujo de entrega

`deploy-qa` depende de la publicación exitosa de ambas imágenes. En pushes o ejecuciones manuales sobre `main`, promueve automáticamente las imágenes `${GITHUB_SHA}` a QA mediante el parámetro `imgURL` de los deploy hooks. Luego ejecuta el smoke test.

`deploy-prod` depende de un `deploy-qa` exitoso, usa el Environment `production` y queda esperando la aprobación de su required reviewer antes de acceder a los secretos o ejecutar pasos. La concurrencia `deploy-production` evita dos despliegues productivos simultáneos. Tras la aprobación promueve exactamente las mismas imágenes y ejecuta el smoke de producción.

El workflow también admite `workflow_dispatch` sobre `main` para poder demostrar por separado una corrida rechazada y otra aprobada sin crear cambios artificiales adicionales.

## Smoke test

El script `scripts/smoke-test.sh` realiza hasta 40 intentos, separados por 15 segundos, con un timeout de 10 segundos por request. Verifica:

1. `/health` del backend con estado `ok`, conexión real a la base y SHA esperado;
2. `/api/categories` como endpoint funcional que consulta PostgreSQL;
3. `/` del frontend y el texto visible `TP6 · Continuous Delivery`;
4. `/version` del frontend con el mismo SHA.

La repetición contempla cold starts y el tiempo asincrónico que Render necesita para descargar y activar las imágenes. Que el deploy hook responda correctamente sólo significa que aceptó la solicitud; el smoke es el que confirma que la versión está lista.

## Aprobación, rechazo y evidencias

- GitHub Environment QA: https://github.com/figueroamatias/ingsoft3/deployments/activity_log?environments_filter=qa
- GitHub Environment producción: https://github.com/figueroamatias/ingsoft3/deployments/activity_log?environments_filter=production
- PENDIENTE: URL pública del frontend y backend QA.
- PENDIENTE: URL pública del frontend y backend de producción.
- PENDIENTE: corrida con producción rechazada y motivo específico observado en QA.
- PENDIENTE: corrida posterior aprobada, smoke productivo verde y URL del deployment.
- PENDIENTE: Release `v6.0.0`, que sólo se creará sobre el SHA realmente aprobado y activo en producción.

El rechazo no se puede simular sin servicios reales: primero QA debe desplegar y pasar su smoke; luego se rechazará el job de producción desde GitHub Actions dejando un comentario relacionado con esa corrida. En una segunda ejecución sobre el mismo `main` se aprobará producción.

## Rollback

El rollback consiste en identificar el SHA de la última versión buena y volver a invocar los hooks de backend y frontend con sus imágenes inmutables anteriores:

```text
ghcr.io/figueroamatias/ingsoft3-backend:<SHA_BUENO>
ghcr.io/figueroamatias/ingsoft3-frontend:<SHA_BUENO>
```

Después se ejecuta el mismo smoke test con `<SHA_BUENO>`. PENDIENTE: medir el tiempo desde que se disparan ambos hooks hasta que el smoke confirma la versión anterior en producción.

Este rollback revierte contenedores, pero no deshace cambios de datos ni migraciones. Si una migración eliminara una columna, desplegar la imagen anterior no la recrearía; los cambios de esquema deben diseñarse de forma compatible y disponer de su propio plan de recuperación.

## Configuración manual pendiente

1. Reautenticar la conexión de Render o ingresar al Dashboard.
2. Crear dos PostgreSQL distintos, uno para QA y otro para producción. En un mismo workspace no pueden ser ambos gratuitos.
3. Crear cuatro servicios web basados en las imágenes GHCR con tag SHA, desactivar auto-deploy y configurar los backends con las credenciales internas de su base correspondiente.
4. Configurar `BACKEND_URL` en cada frontend con la URL pública de su backend, sin `/` final.
5. Ejecutar `database/init.sql` por separado en ambas bases.
6. Guardar los deploy hooks y URLs en sus GitHub Environments.
7. Verificar manualmente los cuatro servicios y cambiar `CD_ENABLED` a `true`.
8. Ejecutar el workflow desde `main`, dejar producción esperando y rechazarla con un motivo concreto.
9. Ejecutarlo nuevamente, aprobar producción y verificar el smoke.
10. Medir un rollback real a un SHA bueno anterior y volver a desplegar la versión aprobada.
11. Completar las URLs y el tiempo de rollback en esta sección.
12. Crear `v6.0.0` y su Release únicamente sobre el SHA confirmado en producción.

## Riesgos y limitaciones

- Los servicios web gratuitos pueden sufrir cold starts y comparten una cuota mensual de horas.
- Render permite una sola PostgreSQL gratuita por workspace y la elimina después del período gratuito si no se actualiza el plan.
- Los deploy hooks son secretos y no deben aparecer en logs ni archivos versionados.
- Mientras `CD_ENABLED=false`, las imágenes se publican pero los deployments se omiten deliberadamente para no producir falsos fallos ni despliegues incompletos.
- La estrategia elegida sí promueve la misma imagen bit a bit mediante `imgURL`; si se cambiara a servicios Git-backed, sólo podría garantizarse el mismo commit porque Render reconstruiría la imagen.

## Problemas encontrados y soluciones

- La conexión de Render solicitó reautenticación. No se inventaron tokens, hooks ni URLs y se dejó pendiente sólo la infraestructura externa.
- La protección de `main` no tenía checks asociados pese a la documentación previa. Se restauraron los dos checks de CI existentes.
- Docker Desktop no inició su motor Linux durante la validación local. Los tests, coverage, build de Vite, sintaxis YAML, scripts y Compose pudieron verificarse; el build y smoke con contenedores quedan pendientes de repetir cuando el motor esté disponible.

## Uso de Inteligencia Artificial

Se utilizaron ChatGPT y Codex para auditar el repositorio, contrastar la arquitectura con la documentación vigente de GitHub y Render, extender el workflow, preparar la configuración runtime, los scripts de deploy y smoke, y organizar el procedimiento de rollback. Las propuestas se validaron con tests, coverage, builds y comprobaciones locales; ningún deploy, aprobación o evidencia externa se declara realizado sin una ejecución real.

## Resumen para defensa TP6

- **CI** verifica cada cambio; **Continuous Delivery** deja una versión lista para producción pero exige aprobación; **Continuous Deployment** la publicaría automáticamente sin esa decisión humana. Nuestro flujo implementa Delivery.
- Un **artefacto** es la imagen Docker resultante. El SHA permite saber exactamente qué commit contiene y evita que una etiqueta mutable cambie de contenido.
- QA se despliega automáticamente porque es el entorno de validación posterior a CI. Producción espera aprobación para revisar el resultado de QA y decidir el riesgo.
- Los **GitHub Environments** separan secretos, URLs, historial y reglas de aprobación.
- QA y producción no comparten base para que las pruebas no modifiquen datos reales.
- El smoke comprueba frontend, backend, consulta a PostgreSQL y SHA; un hook aceptado no basta porque Render todavía puede estar descargando o arrancando la imagen.
- **Deploy** es poner una versión en un entorno. **Release** es declarar oficialmente una versión aprobada, en este caso mediante `v6.0.0`.
- **Promover** significa desplegar en producción las mismas imágenes SHA que pasaron por QA.
- Nuestra estrategia garantiza **same image**. Una reconstrucción del proveedor garantizaría sólo **same commit**, no identidad bit a bit.
- El rollback vuelve a desplegar las imágenes de un SHA bueno anterior y repite el smoke, pero no revierte automáticamente PostgreSQL.
- **Recreate** detiene la versión anterior antes de iniciar la nueva; es simple pero tiene downtime. **Rolling** reemplaza instancias gradualmente. **Blue-green** mantiene dos entornos completos y cambia el tráfico. **Canary** entrega primero a una fracción de usuarios. **Feature flags** separan activación funcional de despliegue.
- Para esta aplicación pequeña tiene sentido el rolling administrado por Render. Blue-green o canary agregarían costo y complejidad; serían razonables si crecieran el tráfico y el riesgo funcional.
