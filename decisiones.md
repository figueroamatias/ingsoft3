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