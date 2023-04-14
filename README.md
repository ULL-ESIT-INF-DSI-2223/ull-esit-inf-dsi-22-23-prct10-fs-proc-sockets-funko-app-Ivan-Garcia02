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
  - [Ejercicio 1](#ejercicio-1)
  - [Ejercicio 2](#ejercicio-2)
  - [Ejercicio 3](#ejercicio-3---cliente-y-servidor-para-aplicación-de-registro-de-funko-pops)
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


### Ejercicio 2
Para este ejercicio nos pedían implementar una aplicación que proporcione información sobre el número de líneas, palabras o caracteres que contiene un fichero de texto. Hemos hecho dos funciones una haciendo uso del método `pipe` de un `Stream` y otra sin hacer uso de este.

En ambas funciones los parámetros que se pasan como argumento son el fichero a analizar y las opciones (Información de líneas y/o palabras y/o caracteres además del fichero de nuevo). Al comienzo de las funciones lo primero que hacemos en ambas es comprobar que tenemos acceso al fichero con la función asincrona `access`. En caso de no tener acceso, se emite un mensaje de error y en caso de tener acceso al fichero si implementa la aplicación según con `pipe` o no.

#### wcConPipe
Para esta función lo primero que hacemos es crear el proceso con `spawn`, en el que indicamos que queremos usar el comando `wc` con las opciones indicadas por parámetros. A continuación, redirigimos la salida del proceso `wc` a la estándar de consola con un `pipe`.
```typescript
const wc = spawn('wc', options);
wc.stdout.pipe(process.stdout);
```

#### wcSinPipe
Para esta función lo primero que hacemos también será crear el proceso con `spawn`, en el que indicamos que queremos usar el comando `wc` con las opciones indicadas por parámetros. A continuación, creamos la variable `wcOutput` que vamos a utilizar para ir almacenando el contenido del stream `wc`, con el evento `data`. Después, con el evento `close`, separamos la variable `wcOutput` en un array para trabajar mejor y según las opciones seleccionadas imprimir la información del fichero.
```typescript
const wc = spawn('wc', options);

let wcOutput: string = '';
wc.stdout.on('data', (piece) => wcOutput += piece);

wc.on('close', () => {
  const wcOutputAsArray = wcOutput.split(/\s+/);
  let position: number = 0;
  if (wcOutputAsArray[0] == '') {
    position = 1;
  }

  if (options.find(op => op === '-l')) {
    console.log(`El fichero ${fichero}, tiene ${wcOutputAsArray[position++]} lineas`);
  }
  if (options.find(op => op === '-w')) {
    console.log(`El fichero ${fichero}, tiene ${wcOutputAsArray[position++]} palabras`);
  }
  if (options.find(op => op === '-c')) {
    console.log(`El fichero ${fichero}, tiene ${wcOutputAsArray[position]} caracteres`);
  }

  if(options.length === 1) {
    console.log(`El fichero ${fichero}, tiene ${wcOutputAsArray[position++]} lineas`);
    console.log(`El fichero ${fichero}, tiene ${wcOutputAsArray[position++]} palabras`);
    console.log(`El fichero ${fichero}, tiene ${wcOutputAsArray[position]} caracteres`);
  }
});
```

#### index.ts
En este fichero definiremos el código encargado de la interacción con el usuario a través de la línea de comandos, para ello vamos a hacer uso del paquete `yargs`.

Definimos un comando que es `wc` y que pide un fichero `file` y como opcionales se pueden poner las opciones de `lines`, `words` y `chars`. Según las opciones indicadas, se incluyen en un vector para después llamar a las funciones `wcConPipe` y `wcSinPipe`, con el fichero y las opciones seleccionadas.


### Ejercicio 3 - Cliente y servidor para aplicación de registro de Funko Pops
Para este ejercicio nos pedían, que partiendo de la implementación de la practica anterior de *FunkoApp*, escribieramos un servidor y un cliente haciendo uso de los sockets proporcionados por el módulo net de Node.js. Por ello tenemos el fichero `funko.ts` que contiene la declaración de la clase `Funko` para declarar funkos.

#### servidor.ts
El servidor será el encargado de procesar la petición, preparar y envíar una respuesta de vuelta al cliente, es por ello que lo primero que hacemos es crear el servidor con `net.createServer((connection)` y ponernos a escuchar en el puerto correspondiente. A continuación, cuando recibamos un evento `data`, lo parseamos, y creamos el array de funkos a partir de los ficheros correspondientes al usuario de la petición, para ello usamos las funciones asincronas `access`, `readdir` y `readFile` y cuando estas hayan terminado de analizar todos los fichero e incluirlos a la colección de Funkos, emitiremos un evento con el tipo de petición a realizar:

- **add:** Lo primero que haremos es parsear el mensaje, para si no existe el ID a inlcuir en la colección, crearlo y guardarlo en ficheros haciendo uso de la función `writeFunkoFile` que hara uso de las funciones asincronas `access`, `mkdir` y `writeFile`. A continuación, creamos la respuesta, la enviamos al cliente y cerramos la conexión con este. En caso de que el ID existiese mandamos un mensaje con el valor `sucess` a *false*.

- **update:** Lo primero que haremos es parsear el mensaje, para si existe el ID a modificar en la colección, modificarlo y guardarlo en ficheros haciendo uso de la función `writeFunkoFile` que hara uso de las funciones asincronas `access`, `mkdir` y `writeFile`. A continuación, creamos la respuesta, la enviamos al cliente y cerramos la conexión con este. En caso de que el ID no existiese mandamos un mensaje con el valor `sucess` a *false*.

- **remove:** Lo primero que haremos es parsear el mensaje, para si existe el ID a eliminar de la colección, eliminarlo de los ficheros haciendo uso de las función asincrona `rm`. A continuación, creamos la respuesta, la enviamos al cliente y cerramos la conexión con este. En caso de que el ID no existiese mandamos un mensaje con el valor `sucess` a *false*.

- **show:** Lo primero que haremos es parsear el mensaje, para si existe el ID a mostrar de la colección, crear la respuesta en la que incluimos un array con el funko a mostrar y enviarlo al cliente y cerramos la conexión con este. En caso de que el ID no existiese mandamos un mensaje con el valor `sucess` a *false*.

- **list:** Lo primero que haremos es parsear el mensaje, después creamos la respuesta en la que incluimos un array con los funkos a mostrar y enviarlos al cliente y cerramos la conexión con este.

#### cliente.ts
El cliente será el encargado de haciendo uso de `yargs`, se introduzcan todos los datos y el comando a ejecutar, para construir una petición y mandarsela al servidor. Para ello con `yargs` obtenemos todos los datos necesarios, al igual que en la practica anterior, para guardarlos en unas variable globales que usará el cliente.

A continuación, creamos una conexión con el servidor con `net` y aprovechamos para desde la conexión, realizar un envío de datos al servidor con `write`, en la que en formato JSON enviamos la peticion que construimos en el yargs.

Después, cuando reciba datos los irá almacenando en `wholeData`, para cuando el servidor emite un evento `end` y cierre la conexión el cliente parsea los datos recibidos y en un `switch-case` según el comando a ejecutar y si hubo exito o no, imprimir un mensaje personalizado de exito o no (haciendo uso de `chalk`) y en el caso de mostrar funkos imprimir los funkos tambien.


## Ejercicio Modificación
En este ejercicio nos pedían escribir un servidor y un cliente haciendo uso de los sockets proporcionados por el módulo `net` de Node.js. De tal forma que el cliente hiciera una petición de un comando a ejecutar al servidor, el servidor la ejecuta y le envía la salida del comando al cliente.

#### cliente.ts
Para ello en el código del cliente, primero comprobamos que al menos recibimos 3 parámetros (con el comando a ejecutar por el servidor). A continuación, creamos una conexión con el servidor con `net` y aprovechamos para desde la conexión, realizar un envío de datos al servidor con `write`, en la que en formato JSON enviamos el comando a ejecutar y sus opciones.

A continuación, cuando reciba datos los irá almacenando en `wholeData`, para cuando el servidor emite un evento `end` y cierre la conexión el cliente parsea los datos recibidos y los imprime por pantalla.
```typescript
if (process.argv.length < 3) {
  console.log('Por favor introduzca un comando.');
} else {
  let opciones: string[] = [];
  for (let i = 3; i < process.argv.length; i++) {
    opciones.push(process.argv[i]);
  }

  const client = net.connect({port: 60300}, () => {
    client.write(JSON.stringify({'comando': process.argv[2], 'opciones': opciones}));
  });

  let wholeData = '';
  client.on('data', (dataChunk) => { 
    wholeData += dataChunk;
  });

  client.on('end', () => { 
    const message = JSON.parse(wholeData);

    if(message.flag) {
      console.log('Salida del comando: \n' + message.salida);
    }
    else {
      console.log('Error en el comando');
    }
  });
}
```

#### servidor.ts
En la parte del servidor lo primero que hacemos es crear el servidor con `net.createServer((connection)` y ponernos a escuchar en el puerto correspondiente. A continuación, cuando recibamos un evento `data`, lo parseamos, y creamos un proceso con `spawn` para ejecutarlo. Después obtenemos la información de salida del comando y la enviamos al cliente con un `write` para, a continuación, cerrar la conexión con el cliente `end`.
```typescript
net.createServer((connection) => {
  console.log('A client has connected.');
 
  connection.on('data', (dataJSON) => {
    const message = JSON.parse(dataJSON.toString());
    console.log('Comando a ejecutar: ' + message.comando + ' ' + message.opciones);

    const comando = spawn(message.comando, message.opciones);
    let comandoOutput = '';
    comando.stdout.on('data', (piece) => comandoOutput += piece);
  
    comando.on('close', () => {
      connection.write(JSON.stringify({'flag': true, 'salida': comandoOutput}));
      connection.end();
    });
  });

  connection.on('close', () => {
    console.log('A client has disconnected.');
  });
}).listen(60300, () => {
  console.log('Waiting for clients to connect.');
});
```


## Conclusiones
En esta práctica hemos realizado varios ejercicios con los que hemos practicado los conceptos explicados en clase, sobre Node.js, las APIs asíncronas de gestión del sistema de ficheros (módulo `fs`), de creación de procesos (módulo `child_process`) y de creación de sockets (módulo `net`) de Node.js. y los paquetes `yargs` y `chalk`.

En concreto, he practicado más profundamente las funciones de la API asíncrona de Node.js, `writefile`, `readfile`, `access`, `mkdir` y `rm`. Además de los eventos a emitir por sockets `data`, `end`...

## Bibliografía
- [Guion de la práctica](https://ull-esit-inf-dsi-2223.github.io/prct10-fs-proc-sockets-funko-app/)
- [Guion de la práctica anterior](https://ull-esit-inf-dsi-2223.github.io/prct09-filesystem-funko-app/)
- [Repositorio de la práctica anterior](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct09-funko-app-Ivan-Garcia02)
- [Apuntes de la asignatura](https://ull-esit-inf-dsi-2223.github.io/nodejs-theory/)