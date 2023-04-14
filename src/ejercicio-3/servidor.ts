import * as net from 'net';
import { TipoFunko, GeneroFunko, Funko } from "./funko";
import { readFile, readdir, access, writeFile, mkdir, rm, constants } from 'fs';
import { RequestType, ValoresFunko } from './cliente';

export type ResponseType = {
  type: 'add' | 'update' | 'remove' | 'show' | 'list';
  success: boolean;
}

net.createServer((connection) => {
  console.log('Se ha conectado un cliente');

  let funkoPops: Funko[] = [];
  let globalData = '';
  connection.on('data', (dataJSON) => {
    globalData += dataJSON;
    const message = JSON.parse(dataJSON.toString());
    const peticion: RequestType = message.peticion;
    
    access(('./data/' + peticion.usuario), constants.F_OK, (err) => {
      if (!err) {
        readdir('./data/' + peticion.usuario, (erro, files) => {
          if (!erro) {
            let fileCount = files.length; // Inicializar el contador de archivos
            files.forEach(funkoFile => {
              readFile('./data/' + peticion.usuario + '/' + funkoFile, (error, data) => {
                if (!error) {
                  let dataJson =  JSON.parse(data.toString());
                  let funko: Funko = new Funko (dataJson.ID, dataJson.nombre, dataJson.descripcion, dataJson.tipo, dataJson.genero, dataJson.franquicia, dataJson.numeroFranquicia, dataJson.exclusivo, dataJson.caractericticasEspeciales, dataJson.valorMercado);
                  funkoPops.push(funko);

                  fileCount--; // Reducir el contador de archivos pendientes
                  if (fileCount === 0) { // Si no quedan archivos pendientes, emitir el evento
                    connection.emit(peticion.type);
                  }
                }
              });
            });
          }
        });
      }
      else {
        connection.emit(peticion.type);
      }
    });
  });


  connection.on('add', () => {
    console.log('Un cliente quiere añadir');
    const message = JSON.parse(globalData);
    const peticion: RequestType = message.peticion;
    const valores: ValoresFunko = message.valores;
    
    if (existeID(funkoPops, peticion.ID) === -1) { // NO existe el ID
      writeFunkoFile(peticion.usuario, valores.ID, valores.nombre, valores.descripcion, valores.tipo, valores.genero, valores.franquicia, valores.numeroFranquicia, valores.exclusivo, valores.caracteristicasEspeciales, valores.valorMercado);
      let respuesta: ResponseType = {type: 'add', success: true};
      connection.write(JSON.stringify({'respuesta': respuesta}));
      connection.end();
    }
    else {
      let respuesta: ResponseType = {type: 'add', success: false};
      connection.write(JSON.stringify({'respuesta': respuesta}));
      connection.end();
    }
  });

  connection.on('update', () => {
    console.log('Un cliente quiere modificar');
    const message = JSON.parse(globalData);
    const peticion: RequestType = message.peticion;
    const valores: ValoresFunko = message.valores;
    
    let index: number = existeID(funkoPops, peticion.ID);
    if (index !== -1) { // Existe el ID
      writeFunkoFile(peticion.usuario, valores.ID, valores.nombre, valores.descripcion, valores.tipo, valores.genero, valores.franquicia, valores.numeroFranquicia, valores.exclusivo, valores.caracteristicasEspeciales, valores.valorMercado);
      let respuesta: ResponseType = {type: 'update', success: true};
      connection.write(JSON.stringify({'respuesta': respuesta}));
      connection.end();
    }
    else {
      let respuesta: ResponseType = {type: 'update', success: false};
      connection.write(JSON.stringify({'respuesta': respuesta}));
      connection.end();
    }
  });

  connection.on('remove', () => {
    console.log('Un cliente quiere eliminar');
    const message = JSON.parse(globalData);
    const peticion: RequestType = message.peticion;
    
    let index: number = existeID(funkoPops, peticion.ID);
    if (index !== -1) { // Existe el ID
      rm('./data/' + peticion.usuario + '/' + peticion.ID + '.json', () => {});
      let respuesta: ResponseType = {type: 'remove', success: true};
      connection.write(JSON.stringify({'respuesta': respuesta}));
      connection.end();
    }
    else {
      let respuesta: ResponseType = {type: 'remove', success: false};
      connection.write(JSON.stringify({'respuesta': respuesta}));
      connection.end();
    }
  });

  connection.on('show', () => {
    console.log('Un cliente quiere mostrar');
    const message = JSON.parse(globalData);
    const peticion: RequestType = message.peticion;
    let funkos: ValoresFunko[] = [];
    
    let index: number = existeID(funkoPops, peticion.ID);
    if (index !== -1) { // Existe el ID
      let respuesta: ResponseType = {type: 'show', success: true};
      funkos.push({ID: funkoPops[index].ID, nombre: funkoPops[index].nombre, descripcion: funkoPops[index].descripcion, tipo: funkoPops[index].tipo, genero: funkoPops[index].genero, franquicia: funkoPops[index].franquicia, numeroFranquicia: funkoPops[index].numeroFranquicia, exclusivo: funkoPops[index].exclusivo, caracteristicasEspeciales: funkoPops[index].caracteristicasEspeciales, valorMercado: funkoPops[index].valorMercado});
      connection.write(JSON.stringify({'respuesta': respuesta, 'funkos': funkos}));
      connection.end();
    }
    else {
      let respuesta: ResponseType = {type: 'show', success: false};
      connection.write(JSON.stringify({'respuesta': respuesta}));
      connection.end();
    }
    });

    connection.on('list', () => {
      console.log('Un cliente quiere listar');
      const message = JSON.parse(globalData);
      let funkos: ValoresFunko[] = [];
      let respuesta: ResponseType = {type: 'list', success: true};
      
      for(let i = 0; i < funkoPops.length; i++) {
        funkos.push({ID: funkoPops[i].ID, nombre: funkoPops[i].nombre, descripcion: funkoPops[i].descripcion, tipo: funkoPops[i].tipo, genero: funkoPops[i].genero, franquicia: funkoPops[i].franquicia, numeroFranquicia: funkoPops[i].numeroFranquicia, exclusivo: funkoPops[i].exclusivo, caracteristicasEspeciales: funkoPops[i].caracteristicasEspeciales, valorMercado: funkoPops[i].valorMercado});
      }

      connection.write(JSON.stringify({'respuesta': respuesta, 'funkos': funkos}));
      connection.end();
    });

    connection.on('close', () => {
      console.log('Un cliente se ha desconectado');
    });
}).listen(60300, () => {
  console.log('Esperando clientes a conectar');
});


/**
 * Función encargada de cargar un Funko a un fichero JSON
 * @param ID Identificador único del Funko
 * @param nombre Nombre del Funko
 * @param descripcion Descripcion del Funko
 * @param tipo Tipo, Pop!, Pop! Rides, Vynil Soda o Vynil Gold, entre otros
 * @param genero Genero, Animación, Películas y TV, Videojuegos, Deportes, Música o Ánime, entre otras
 * @param franquicia Franquicia, The Big Bang Theory, Game of Thrones, Sonic The Hedgehog o Marvel: Guardians of the Galaxy, entre otras.
 * @param numeroFranquicia Número identificativo del Funko dentro de la franquicia correspondiente
 * @param exclusivo Verdadero en el caso de que el Funko sea exclusivo o falso en caso contrario
 * @param caracteristicasEspeciales Característica especiales del Funko como, por ejemplo, si brilla en la oscuridad o si su cabeza balancea
 * @param valorMercado Precio del Funko 
 */
function writeFunkoFile(usuario: string, ID: number, nombre: string, descripcion: string, tipo: TipoFunko, genero: GeneroFunko, franquicia: string, numeroFranquicia: number, exclusivo: boolean, caracteristicasEspeciales: string, valorMercado: number) {
  let funkoToSave = {ID: ID, nombre: nombre, descripcion: descripcion, tipo: tipo, genero: genero, franquicia: franquicia, numeroFranquicia: numeroFranquicia, exclusivo: exclusivo, caractericticasEspeciales: caracteristicasEspeciales, valorMercado: valorMercado};

  access(('./data/' + usuario), constants.F_OK, (err) => {
    if (err) {
      mkdir('./data/' + usuario, (err) => {
        if (err) {
          return console.error(err);
        }
        console.log('Directory created successfully!');
      });
    }
    writeFile('./data/' + usuario + '/' + ID + '.json', JSON.stringify(funkoToSave, null, 2), () => {});
  });
}

/**
 * Método para saber si existe un ID y para saber su índice
 * @param funkoPops Coleccion de funkos a buscar el ID
 * @param ID Identificador único del Funko
 * @returns el indice del ID a buscar o -1
 */
function existeID(funkoPops: Funko[], ID: number | undefined) : number {
  let indexFound: number = -1;

  if (ID !== undefined) {
    funkoPops.forEach((funko, index) => {
      if (funko.ID === ID) {
        indexFound = index
      }
    })
  }

  return indexFound;
}