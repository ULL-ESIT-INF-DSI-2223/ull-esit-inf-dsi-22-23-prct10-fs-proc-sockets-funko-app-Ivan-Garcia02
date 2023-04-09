import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { wcSinPipe } from './wcSinPipe';
import { wcConPipe } from './wcConPipe';

/**
 * Ejecución:
 * ```bash
 * $node dist/ejercicio-2/index.js wc --file helloworld.txt
 * $node dist/ejercicio-2/index.js wc --file helloworld.txt --lines --chars
 * ```
 */
yargs(hideBin(process.argv))
 .command('wc', 'Información sobre el número de líneas, palabras o caracteres de un fichero', {
  file: {
   description: 'Nombre de fichero',
   type: 'string',
   demandOption: true
  },
  lines: {
    description: 'Numero de lineas',
    type: 'boolean'
  },
  words: {
    description: 'Numero de lineas',
    type: 'boolean'
  },
  chars: {
    description: 'Numero de lineas',
    type: 'boolean'
  }

 }, (argv) => {
  
  let options: string[] = [];
  if(argv.lines) {
    options.push('-l');
  }
  if(argv.words) {
    options.push('-w');
  }
  if(argv.chars) {
    options.push('-c');
  }
  options.push(argv.file);

  wcConPipe(argv.file, options);
  wcSinPipe(argv.file, options);
 })

 .help()
 .argv;