import * as net from 'net';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Funko, TipoFunko, GeneroFunko, convertGeneroFunko, convertTipoFunko } from './funko';
import { ResponseType } from './servidor';
import chalk = require('chalk');

export type RequestType = {
  type: 'add' | 'update' | 'remove' | 'show' | 'list';
  usuario: string;
  ID: number;
}

export type ValoresFunko = {
  ID: number;
  nombre: string;
  descripcion: string;
  tipo: TipoFunko;
  genero: GeneroFunko;
  franquicia: string;
  numeroFranquicia: number;
  exclusivo: boolean;
  caracteristicasEspeciales: string;
  valorMercado: number;
}

let peticion: RequestType;
let valoresFunko: ValoresFunko;
/**
 * Ejecucion:
 * ```bash
 * node dist/ejercicio-3/cliente.js add --user 'ivan' --id 1 --name 'Iron Man' --desc 'Funko Pop de Iron Man' --type 'Pop!' --gener 'Peliculas' --franq 'Marvel' --num 1 --excl false --carac '' --value 30.15
 * node dist/ejercicio-3/cliente.js modify --user 'ivan' --id 3 --name 'AquaMan' --desc 'Funko Pop de Aquaman' --type 'Pop! Rides' --gener 'Peliculas' --franq 'DC' --num 1 --excl true --carac 'Funko Acuatico' --value 4.87
 * node dist/ejercicio-3/cliente.js remove --user 'ivan' --id 3
 * node dist/ejercicio-3/cliente.js list --user 'ivan'
 * node dist/ejercicio-3/cliente.js show --user 'ivan' --id 3
 * ```
 */
yargs(hideBin(process.argv))
  .command('add', 'Añadir un funko', {
  user: {
   description: 'Nombre de usuario',
   type: 'string',
   demandOption: true
  },
  id: {
   description: 'Funko ID',
   type: 'number',
   demandOption: true
  },
  name: {
    description: 'Funko Nombre',
    type: 'string',
    demandOption: true
  },
  desc: {
    description: 'Funko Descripcion',
    type: 'string',
    demandOption: true
  },
  type: {
    description: 'Funko Tipo',
    type: 'string',
    demandOption: true
  },
  gener: {
    description: 'Funko Genero',
    type: 'string',
    demandOption: true
  },
  franq: {
    description: 'Funko Franquicia',
    type: 'string',
    demandOption: true
  },
  num: {
    description: 'Funko Número Franquicia',
    type: 'number',
    demandOption: true
  },
  excl: {
    description: 'Funko Exclusivo',
    type: 'boolean',
    demandOption: true
  },
  carac: {
    description: 'Funko Caractericticas Especiales',
    type: 'string',
    demandOption: true
  },
  value: {
    description: 'Funko Valor Mercado',
    type: 'number',
    demandOption: true
  }

 }, (argv) => {
  peticion = {type: 'add', usuario: argv.user, ID: argv.id};
  valoresFunko = {ID: argv.id, nombre: argv.name, descripcion: argv.desc, tipo: convertTipoFunko(argv.type), genero: convertGeneroFunko(argv.gener), franquicia: argv.franq, numeroFranquicia: argv.num, exclusivo: argv.excl, caracteristicasEspeciales: argv.carac, valorMercado: argv.value};
 })


 .command('modify', 'Modificar un funko', {
  user: {
   description: 'Nombre de usuario',
   type: 'string',
   demandOption: true
  },
  id: {
   description: 'Funko ID',
   type: 'number',
   demandOption: true
  },
  name: {
    description: 'Funko Nombre',
    type: 'string',
    demandOption: true
  },
  desc: {
    description: 'Funko Descripcion',
    type: 'string',
    demandOption: true
  },
  type: {
    description: 'Funko Tipo',
    type: 'string',
    demandOption: true
  },
  gener: {
    description: 'Funko Genero',
    type: 'string',
    demandOption: true
  },
  franq: {
    description: 'Funko Franquicia',
    type: 'string',
    demandOption: true
  },
  num: {
    description: 'Funko Número Franquicia',
    type: 'number',
    demandOption: true
  },
  excl: {
    description: 'Funko Exclusivo',
    type: 'boolean',
    demandOption: true
  },
  carac: {
    description: 'Funko Caractericticas Especiales',
    type: 'string',
    demandOption: true
  },
  value: {
    description: 'Funko Valor Mercado',
    type: 'number',
    demandOption: true
  }

 }, (argv) => {
  peticion = {type: 'update', usuario: argv.user, ID: argv.id};
  valoresFunko = {ID: argv.id, nombre: argv.name, descripcion: argv.desc, tipo: convertTipoFunko(argv.type), genero: convertGeneroFunko(argv.gener), franquicia: argv.franq, numeroFranquicia: argv.num, exclusivo: argv.excl, caracteristicasEspeciales: argv.carac, valorMercado: argv.value};
 })

 
 .command('remove', 'Eliminar un funko', {
  user: {
   description: 'Nombre de usuario',
   type: 'string',
   demandOption: true
  },
  id: {
   description: 'Funko ID',
   type: 'number',
   demandOption: true
  }
 }, (argv) => {
  peticion = {type: 'remove', usuario: argv.user, ID: argv.id};
 })


 .command('list', 'Listar todos los funkos', {
  user: {
   description: 'Nombre de usuario',
   type: 'string',
   demandOption: true
  }
 }, (argv) => {
  peticion = {type: 'list', usuario: argv.user, ID: 0};

 })


 .command('show', 'Mostra un funko concreto', {
  user: {
   description: 'Nombre de usuario',
   type: 'string',
   demandOption: true
  },
  id: {
   description: 'Funko ID',
   type: 'number',
   demandOption: true
  }
 }, (argv) => {
  peticion = {type: 'show', usuario: argv.user, ID: argv.id};

 })

 .help()
 .argv;



const client = net.connect({port: 60300}, () => {
  switch (peticion.type) {
    case 'add':
    case 'update':
      client.write(JSON.stringify({'peticion': peticion, 'valores': valoresFunko}));
    break;
  
    case 'remove':
    case 'show':
    case 'list':
      client.write(JSON.stringify({'peticion': peticion}));
    break;
  }
});

let wholeData = '';
client.on('data', (dataChunk) => {
  wholeData += dataChunk;
});

client.on('end', () => {
  const message = JSON.parse(wholeData);
  const respuesta: ResponseType = message.respuesta;

  switch (respuesta.type) {
    case 'add':
      if(respuesta.success) {
        console.log(chalk.green(`Funko añadido a la coleccion de ${peticion.usuario}.`));
      }
      else {
        console.log(chalk.red(`Funko NO añadido a la coleccion de ${peticion.usuario}, ya existe.`));
      }
    break;
    case 'update':
      if(respuesta.success) {
        console.log(chalk.green(`Funko modificado de la coleccion de ${peticion.usuario}.`));
      }
      else {
        console.log(chalk.red(`Funko NO modificado de la coleccion de ${peticion.usuario}, NO existe.`));
      }
    break;
    case 'remove':
      if(respuesta.success) {
        console.log(chalk.green(`Funko eliminado de la coleccion de ${peticion.usuario}.`));
      }
      else {
        console.log(chalk.red(`Funko NO eliminado de la coleccion de ${peticion.usuario}, NO existe.`));
      }
    break;
  
    case 'show':
    case 'list':
      if(respuesta.success) {
        for (let i = 0; i < message.funkos.length; i++) {
          let funko: Funko = new Funko(message.funkos[i].ID, message.funkos[i].nombre, message.funkos[i].descripcion, message.funkos[i].tipo, message.funkos[i].genero, message.funkos[i].franquicia, message.funkos[i].numeroFranquicia, message.funkos[i].exclusivo, message.funkos[i].caracteristicasEspeciales, message.funkos[i].valorMercado);
          funko.mostrarFunko();
          console.log('------------------------');
        }
      }
      else {
        console.log(chalk.red(`NO existe el Funko en la coleccion de ${peticion.usuario}.`));
      }
    break;
  }
})