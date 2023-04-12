import * as net from 'net';
import {watchFile} from 'fs';
import { FunkoCollection } from "./funkoCollection";
import { TipoFunko, GeneroFunko } from "./funko";

export type ResponseType = {
  type: 'add' | 'update' | 'remove' | 'read' | 'list';
  success: boolean;
}

/*if (process.argv.length !== 3) {
  console.log('Please, provide a filename.');
} else {
  const fileName = process.argv[2];
*/
  net.createServer((connection) => {
    console.log('A client has connected.');

    //connection.write(JSON.stringify({'type': 'watch', 'file': fileName}) + '\n');

    /*watchFile(fileName, (curr, prev) => {
      connection.write(JSON.stringify({
        'type': 'change', 'prevSize': prev.size, 'currSize': curr.size}) +
         '\n');
    });*/  
    connection.on('data', (dataJSON) => {
      const message = JSON.parse(dataJSON.toString());
      //console.log('Mensaje: ' + message.Hola);
      let funkos = new FunkoCollection(message.Nombre);
      funkos.initialize((error?: Error) => {});
      let flag = false;
      flag = funkos.add(5, "Iron Man", "Funko Pop del superheroe IronMan", TipoFunko.Pop, GeneroFunko.Peliculas, "Marvel", 1, false, "", 15.5);
      connection.write(JSON.stringify({'Adios': 'adios', 'Numero': flag}));
      connection.end();
    });

    connection.on('close', () => {
      console.log('A client has disconnected.');
    });
  }).listen(60300, () => {
    console.log('Waiting for clients to connect.');
  });
//}