# Práctica 10 - APIs asíncronas de gestión del sistema de ficheros, creación de procesos y creación de sockets de Node.js
## Desarrollo de Sistemas Informáticos

> **Nombre:** Iván García González **Correo:** alu0101388786@ull.edu.es

<p align="center">
  <a href='https://coveralls.io/github/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-Ivan-Garcia02?branch=main'>
    <img src='https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-Ivan-Garcia02/badge.svg?branch=main' alt='Coverage Status'>
  </a>

  <a href="https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-Ivan-Garcia02/actions/workflows/node.js.yml">
    <img alt="Tests" src="https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-Ivan-Garcia02/actions/workflows/node.js.yml/badge.svg">
  </a>

  <a href="https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2223_ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-Ivan-Garcia02">
    <img alt="Quality Gate Status" src="https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2223_ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-Ivan-Garcia02&metric=alert_status">
  </a>
</p>


## Índice
- [Objetivos](#objetivos-de-la-práctica)
- [Ejercicios propuestos](#ejercicios-propuestos)
  - [Ejercicio 1]()
  - [Ejercicio 2]()
  - [Ejercicio 3]()
- [Ejercicio modificación](#ejercicio-modificación)
- [Conclusiones](#conclusiones)
- [Bibliografía](#bibliografía)


## Objetivos de la práctica
En esta práctica vamos a profundizar en los conceptos explicados en clase, sobre Node.js, las APIs asíncronas de gestión del sistema de ficheros (módulo `fs`), de creación de procesos (módulo `child_process`) y de creación de sockets (módulo `net`) de Node.js. y los paquetes `yargs` y `chalk`.


## Ejercicios propuestos
### Ejercicio 1
#### Traza de ejecución
Ejecutamos el programa, inicialmente con todos los registros vacíos. Vamos a ejecutar el programa con un archivo existente y que se pasa correctamente por parámetros, por lo que pasamos a la línea 8 directamente, a la llamada del `access`.
```markdown
Pila de llamadas:
- access
Registro de eventos de la API:
- vacio
Cola de manejadores:
- vacio

Console:
> Starting to watch file helloworld.txt
> File helloworld.txt is no longer watched
```

Como no se ha producido ninguna modificación en el fichero hasta ahora solo tenemos la llamada a `access`. A continuación, realizamos la primera modificación en el archivo `helloworld.txt`.
```markdown
Pila de llamadas:
- watch
- access
Registro de eventos de la API:
- change (callback de watch)
Cola de manejadores:
- vacio

Console:
> File helloworld.txt has been modified somehow
```

En este punto ya se introduce a la pila de llamadas la función `watch` tras la modificación y se añade al registro de eventos de la API a la callback `change`. Ahora, realizamos la segunda modificación del archivo `helloworld.txt`.
```markdown
Pila de llamadas:
- watch
- access
Registro de eventos de la API:
- change (callback del segundo watch)
Cola de manejadores:
- change (callback del primer watch)

Console:
> File helloworld.txt has been modified somehow
```

Aquí, ya pasado un tiempo, el primer manejador de `change` ya se ha movido a la cola, y se ha añadido un nuevo manejador `change` con la nueva modificación al registro de eventos de la API.

#### ¿Qué hace la función access? 
La función `access` se utiliza para comprobar si un archivo existe y si es accesible para el proceso en ejecución, esta prueba los permisos del usuario para el archivo o directorio especificado en la ruta `path`. En este caso, comprueba si el archivo proporcionado existe, antes de empezar a vigilarlo para detectar cambios.

#### ¿Para qué sirve el objeto constants?
El objeto constants es un entero opcional que especifica las verificaciones de accesibilidad que se deben realizar, como por ejemplo, los modos de apertura de archivos o los permisos de acceso. En este caso, se utiliza la constante `F_OK`, que indica que el archivo es visible para el proceso que lo llama, pero no dice nada sobre los permisos *rwx*. Esto es util para indicar que solo se desea comprobar la existencia del archivo.




## Ejercicio Modificación





## Conclusiones
En esta práctica hemos realizado varios ejercicios con los que hemos practicado los conceptos explicados en clase, sobre Node.js, las APIs asíncronas de gestión del sistema de ficheros (módulo `fs`), de creación de procesos (módulo `child_process`) y de creación de sockets (módulo `net`) de Node.js. y los paquetes `yargs` y `chalk`.
En concreto, he practicado más profundamente las funciones de la API síncrona de Node.js, `writefile`, `readfile`, `exists`, `mkdir` y `rm`.

## Bibliografía
- [Guion de la práctica](https://ull-esit-inf-dsi-2223.github.io/prct10-fs-proc-sockets-funko-app/)
- [Guion de la práctica anterior](https://ull-esit-inf-dsi-2223.github.io/prct09-filesystem-funko-app/)
- [Repositorio de la práctica anterior](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct09-funko-app-Ivan-Garcia02)
- [Apuntes de la asignatura](https://ull-esit-inf-dsi-2223.github.io/nodejs-theory/)