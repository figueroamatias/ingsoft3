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