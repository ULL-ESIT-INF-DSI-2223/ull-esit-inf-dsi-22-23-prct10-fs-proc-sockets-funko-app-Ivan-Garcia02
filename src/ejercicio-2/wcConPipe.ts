import { access, constants } from 'fs';
import { spawn } from 'child_process';

/**
 * Función que imita el funcionamiento del comando `wc` de terminal con el uso de Pipe para redirigir la salida
 * @param fichero Fichero a hacer el recuento
 * @param options Opciones para contar líneas, palabras, caracteres, o combinaciones de ellas
 */
export function wcConPipe(fichero: string, options: string[]) {
  access(fichero, constants.F_OK, (err) => {
    if (err) {
      console.log(`El fichero ${fichero} NO existe`);
    } else {
      const wc = spawn('wc', options);
      wc.stdout.pipe(process.stdout);
    }
  });
}