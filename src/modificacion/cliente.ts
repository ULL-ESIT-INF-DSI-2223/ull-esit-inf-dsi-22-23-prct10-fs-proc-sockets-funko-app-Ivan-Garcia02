import * as net from 'net';

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