import { access, constants } from 'fs';
import { spawn } from 'child_process';

/**
 * Función que imita el funcionamiento del comando `wc` de terminal sin el uso de Pipe para redirigir la salida
 * @param fichero Fichero a hacer el recuento
 * @param options Opciones para contar líneas, palabras, caracteres, o combinaciones de ellas
 */
export function wcSinPipe(fichero: string, options: string[]) {
  access(fichero, constants.F_OK, (err) => {
    if (err) {
      console.log(`El fichero ${fichero} NO existe`);
    } else {
      const wc = spawn('/usr/bin/wc', options);

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
    }
  });
}