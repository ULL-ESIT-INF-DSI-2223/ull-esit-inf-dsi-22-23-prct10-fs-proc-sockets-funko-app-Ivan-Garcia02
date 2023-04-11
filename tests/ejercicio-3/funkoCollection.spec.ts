import 'mocha'
import { expect } from "chai";
import { Funko, TipoFunko, GeneroFunko } from "../../src/ejercicio-3/funko";
import { FunkoCollection } from "../../src/ejercicio-3/funkoCollection";

describe('Tests para la clase FunkoCollection', () => {
  it('Se puede crear un objeto de la clase FunkoCollection', () => {
    expect(new FunkoCollection('test')).not.to.be.undefined
  })

  it('Se puede obtener el usuario', () => {
    expect(new FunkoCollection('test').usuario).to.be.eql('test')
  })

  it('Se puede añadir un funko', () => {
    expect(new FunkoCollection('test').add(1, "Iron Man", "Funko Pop del superheroe IronMan", TipoFunko.Pop, GeneroFunko.Peliculas, "Marvel", 1, false, "", 15.5)).to.be.undefined
    expect(new FunkoCollection('test').add(1, "Iron Man", "Funko Pop del superheroe IronMan", TipoFunko.Pop, GeneroFunko.Peliculas, "Marvel", 1, false, "", 15.5)).to.be.undefined
  })
  it('Se puede modificar un funko', () => {
    expect(new FunkoCollection('test').modify(1, "Iron", "Funko Pop del superheroe IronMan", TipoFunko.Pop, GeneroFunko.Peliculas, "Marvel", 1, false, "", 15.5)).to.be.undefined
    expect(new FunkoCollection('test').modify(2, "Iron Man", "Funko Pop del superheroe IronMan", TipoFunko.Pop, GeneroFunko.Peliculas, "Marvel", 1, false, "", 15.5)).to.be.undefined
  })
  it('existeID', () => {
    expect(new FunkoCollection('test').existeID(1)).to.be.eql(0)
    expect(new FunkoCollection('test').existeID(2)).to.be.eql(-1)
  })
  it('Se puede listar los funkos', () => {
    expect(new FunkoCollection('test').list()).to.be.undefined
  })
  it('Se puede mostrar un funko concreto', () => {
    expect(new FunkoCollection('test').show(1)).to.be.undefined
    expect(new FunkoCollection('test').show(2)).to.be.undefined
  })
  it('Se puede eliminar un funko', () => {
    expect(new FunkoCollection('test').remove(1)).to.be.undefined
    expect(new FunkoCollection('test').remove(2)).to.be.undefined
  })
})