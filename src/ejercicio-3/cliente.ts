import * as net from 'net';

export type RequestType = {
  type: 'add' | 'update' | 'remove' | 'read' | 'list';
}

const client = net.connect({port: 60300}, () => {
  client.write(JSON.stringify({'Nombre': 'ivan'}));
});

client.on('data', (dataJSON) => {
  const message = JSON.parse(dataJSON.toString());
  console.log('Mensaje: ' + message.Adios + message.Numero);
})

/*client.on('data', (dataJSON) => {
  const message = JSON.parse(dataJSON.toString());

  if (message.type === 'watch') {
    console.log(`Connection established: watching file ${message.file}`);
  } else if (message.type === 'change') {
    console.log('File has been modified.');
    console.log(`Previous size: ${message.prevSize}`);
    console.log(`Current size: ${message.currSize}`);
  } else {
    console.log(`Message type ${message.type} is not valid`);
  }
});*/

