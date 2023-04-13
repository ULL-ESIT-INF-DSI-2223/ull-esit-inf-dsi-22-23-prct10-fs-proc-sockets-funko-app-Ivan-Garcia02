import { spawn } from 'child_process';
import * as net from 'net';

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