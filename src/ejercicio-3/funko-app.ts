import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { FunkoCollection } from './funkoCollection';
import { convertTipoFunko, convertGeneroFunko } from './funko';

/**
 * Ejecucion:
 * ```bash
 * node dist/funkoApp/funko-app.js add --user 'ivan' --id 1 --name 'Iron Man' --desc 'Funko Pop de Iron Man' --type 'Pop!' --gener 'Peliculas' --franq 'Marvel' --num 1 --excl false --carac '' --value 30.15
 * node dist/funkoApp/funko-app.js modify --user 'ivan' --id 3 --name 'AquaMan' --desc 'Funko Pop de Aquaman' --type 'Pop! Rides' --gener 'Peliculas' --franq 'DC' --num 1 --excl true --carac 'Funko Acuatico' --value 4.87
 * node dist/funkoApp/funko-app.js remove --user 'ivan' --id 3
 * node dist/funkoApp/funko-app.js list --user 'ivan'
 * node dist/funkoApp/funko-app.js show --user 'ivan' --id 3
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
  let coleccion: FunkoCollection = new FunkoCollection(argv.user);
  coleccion.add(argv.id, argv.name, argv.desc, convertTipoFunko(argv.type), convertGeneroFunko(argv.gener), argv.franq, argv.num, argv.excl, argv.carac, argv.value);
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
  let coleccion: FunkoCollection = new FunkoCollection(argv.user);
  coleccion.modify(argv.id, argv.name, argv.desc, convertTipoFunko(argv.type), convertGeneroFunko(argv.gener), argv.franq, argv.num, argv.excl, argv.carac, argv.value);
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
  let coleccion: FunkoCollection = new FunkoCollection(argv.user);
  coleccion.remove(argv.id);
 })


 .command('list', 'Listar todos los funkos', {
  user: {
   description: 'Nombre de usuario',
   type: 'string',
   demandOption: true
  }
 }, (argv) => {
  let coleccion: FunkoCollection = new FunkoCollection(argv.user);
  coleccion.list();
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
  let coleccion: FunkoCollection = new FunkoCollection(argv.user);
  coleccion.show(argv.id);
 })

 .help()
 .argv;