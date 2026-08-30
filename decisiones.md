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

Se eligió desarrollar un sistema web de control de gastos personales. La aplicación permite trabajar con un dominio pequeño y entendible, con frontend, API y base de datos, sin desviar el objetivo principal de la materia: construir y justificar una cadena DevOps completa durante el semestre.

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

### Problemas encontrados

El formulario inicialmente dejaba la fecha vacía. Esto permitía elegir cualquier fecha, pero también facilitaba intentar un envío incompleto. Se resolvió inicializando el campo con la fecha local actual y manteniéndolo editable.

### Uso de Inteligencia Artificial

Se utilizó Codex como asistencia para analizar la consigna, proponer la separación en capas y preparar la estructura inicial. El resultado se verifica ejecutando PostgreSQL, consultando directamente sus datos, probando los endpoints, comprobando el consumo desde React y construyendo el frontend.
