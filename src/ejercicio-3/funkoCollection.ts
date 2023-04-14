const chalk = require('chalk');
import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync, rmSync,  } from 'fs';
import { readFile, readdir, access, exists, writeFile, mkdir, rm, constants } from 'fs';
import { Funko, GeneroFunko, TipoFunko } from "./funko";

export class FunkoCollection {
  private _usuario: string;
  private _funkoCollection: Funko[];
  public ready: boolean = false;

  /**
   * Constructor de la clase FunkoCollection
   * @param usuario Usuario que tiene la colección
   */
  constructor(usuario: string) {
    this._usuario =  usuario;
    this._funkoCollection = [];

    /*if (existsSync('./data/' + usuario)) {
      const files = readdirSync('./data/' + usuario);
      files.forEach(funkoFile => {
        let data = readFileSync('./data/' + usuario + '/' + funkoFile, 'utf8');
        let dataJson =  JSON.parse(data);
        
        let funko: Funko = new Funko (dataJson.ID, dataJson.nombre, dataJson.descripcion, dataJson.tipo, dataJson.genero, dataJson.franquicia, dataJson.numeroFranquicia, dataJson.exclusivo, dataJson.caractericticasEspeciales, dataJson.valorMercado);
        this._funkoCollection.push(funko);
      })
    }*/
    /*let count = 0;
    access(('./data/' + usuario), constants.F_OK, (err) => {
      console.log('1');
      if (!err) {
        const files = readdir('./data/' + usuario, (erro, files) => {  
          console.log('2');

          files.forEach(funkoFile => {
           console.log('3');

            readFile('./data/' + usuario + '/' + funkoFile, (error, data) => {
              console.log('4');

              let dataJson =  JSON.parse(data.toString());
            
              let funko: Funko = new Funko (dataJson.ID, dataJson.nombre, dataJson.descripcion, dataJson.tipo, dataJson.genero, dataJson.franquicia, dataJson.numeroFranquicia, dataJson.exclusivo, dataJson.caractericticasEspeciales, dataJson.valorMercado);
              this._funkoCollection.push(funko);
            });
            this.ready = true;
          })
        })
      }
    });*/
  }

  async initialize(callback: (error?: Error) => void) {
    const ini= exists('./data/' + this._usuario, (exists) => {
      if (exists) {
        readdir('./data/' + this._usuario, (error, files) => {
          if (error) {
            return callback(error);
          }

          let count = 0;

          for (const funkoFile of files) {
            readFile('./data/' + this._usuario + '/' + funkoFile, 'utf8', (error, data) => {
              if (error) {
                return callback(error);
              }

              const dataJson = JSON.parse(data);
              const funko: Funko = new Funko(dataJson.ID, dataJson.nombre, dataJson.descripcion, dataJson.tipo, dataJson.genero, dataJson.franquicia, dataJson.numeroFranquicia, dataJson.exclusivo, dataJson.caractericticasEspeciales, dataJson.valorMercado);
              this._funkoCollection.push(funko);

              count++;

              if (count === files.length) {
                return callback();
              }
            });
          }
        });
      } else {
        return callback();
      }
      console.log('das');
    });

    await ini;
    
  }

  /** 
   * Getter del atributo usuario 
   * @returns el usuario
   */
  get usuario() {
    return this._usuario;
  }

  /**
   * Método encargado de añadir un nuevo funko a la colección
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
  add(ID: number, nombre: string, descripcion: string, tipo: TipoFunko, genero: GeneroFunko, franquicia: string, numeroFranquicia: number, exclusivo: boolean, caracteristicasEspeciales: string, valorMercado: number) {
    if (this.existeID(ID) === -1) { // NO existe el ID
      this._funkoCollection.push(new Funko(ID, nombre, descripcion, tipo, genero, franquicia, numeroFranquicia, exclusivo, caracteristicasEspeciales, valorMercado));
      this.writeFunkoFile(ID, nombre, descripcion, tipo, genero, franquicia, numeroFranquicia, exclusivo, caracteristicasEspeciales, valorMercado);
      console.log(chalk.green(`Nuevo Funko ${nombre}, añadido a la coleccion de ${this._usuario}.`));
      return true;
    }
    else {
      console.log(chalk.red(`Funko NO añadido a la coleccion de ${this._usuario}, YA existe.`));
      return false;
    }
  }

  /**
   * Método encargado de modificar un funko de la colección
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
  modify(ID: number, nombre: string, descripcion: string, tipo: TipoFunko, genero: GeneroFunko, franquicia: string, numeroFranquicia: number, exclusivo: boolean, caracteristicasEspeciales: string, valorMercado: number) {
    let index: number = this.existeID(ID);
    if (index != -1) { // Existe el ID
      this._funkoCollection[index].ID = ID;
      this._funkoCollection[index].nombre = nombre;
      this._funkoCollection[index].descripcion = descripcion;
      this._funkoCollection[index].tipo = tipo; 
      this._funkoCollection[index].genero = genero;
      this._funkoCollection[index].franquicia = franquicia;
      this._funkoCollection[index].numeroFranquicia = numeroFranquicia;
      this._funkoCollection[index].exclusivo = exclusivo;
      this._funkoCollection[index].caracteristicasEspeciales = caracteristicasEspeciales;
      this._funkoCollection[index].valorMercado = valorMercado;

      this.writeFunkoFile(ID, nombre, descripcion, tipo, genero, franquicia, numeroFranquicia, exclusivo, caracteristicasEspeciales, valorMercado);
      console.log(chalk.green(`Funko modificado en la coleccion de ${this._usuario}.`));
    }
    else {
      console.log(chalk.red(`Funko NO modificado. No existe en la coleccion de ${this._usuario}.`));
    }
  }

  /**
   * Método encargado de eliminar un funko de la colección
   * @param ID Identificador único del Funko
   */
  remove(ID: number) {
    let index: number = this.existeID(ID);
    if (index != -1) { // Existe el ID
      this._funkoCollection.splice(index, 1);
      rm('./data/' + this._usuario + '/' + ID + '.json', () => {});
      console.log(chalk.green(`Funko eliminado de la coleccion de ${this._usuario}.`));
    }
    else {
      console.log(chalk.red(`Funko NO eliminado de la coleccion de ${this._usuario}, NO existe.`));
    }
  }

  /**
   * Método encargado de mostrar todos los funkos de la colección
   */
  list() {
    this._funkoCollection.forEach(funko => {
      funko.mostrarFunko();
      console.log("------------------------------");
    })
  }

  /**
   * Método encargado de mostrar un funko concreto de la colección
   * @param ID Identificador único del Funko
   */
  show(ID: number) {
    let index: number = this.existeID(ID);
    if (index != -1) { // Existe el ID
      this._funkoCollection[index].mostrarFunko();
    }
    else {
      console.log(chalk.red(`NO existe el Funko en la coleccion de ${this._usuario}.`));
    }
  }

  /**
   * Método para saber si existe un ID y para saber su índice
   * @param ID Identificador único del Funko
   * @returns el indice del ID a buscar o -1
   */
  existeID(ID: number) : number {
    let indexFound: number = -1;

    this._funkoCollection.forEach((funko, index) => {
      if (funko.ID === ID) {
        indexFound = index
      }
    })

    return indexFound;
  }

  /**
   * Método privado encargado de cargar un Funko a un fichero JSON
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
  private writeFunkoFile(ID: number, nombre: string, descripcion: string, tipo: TipoFunko, genero: GeneroFunko, franquicia: string, numeroFranquicia: number, exclusivo: boolean, caracteristicasEspeciales: string, valorMercado: number) {
    let funkoToSave = {ID: ID, nombre: nombre, descripcion: descripcion, tipo: tipo, genero: genero, franquicia: franquicia, numeroFranquicia: numeroFranquicia, exclusivo: exclusivo, caractericticasEspeciales: caracteristicasEspeciales, valorMercado: valorMercado};
    /*if (!access('./data/' + this._usuario)) {
      mkdir('./data/' + this._usuario);
    }*/
    access(('./data/' + this._usuario), constants.F_OK, (err) => {
      if (err) {
        mkdir('./data/' + this._usuario, (err) => {
          if (err) {
              return console.error(err);
          }
          console.log('Directory created successfully!');
        });
      }
    }); 
    writeFile('./data/' + this._usuario + '/' + ID + '.json', JSON.stringify(funkoToSave, null, 2), () => {});
  }
}