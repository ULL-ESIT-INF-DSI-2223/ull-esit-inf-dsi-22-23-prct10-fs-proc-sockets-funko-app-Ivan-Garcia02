import 'mocha'
import { expect } from "chai";
import { wcConPipe } from "../../src/ejercicio-2/wcConPipe";

describe('Tests para wcSinPipe', () => {
  it('Prueba de wcSinPipe', () => {
    expect(wcConPipe('hello.txt', ['hello.txt'])).to.be.undefined; // Fichero no existe
    expect(wcConPipe('helloworld.txt', ['helloworld.txt'])).to.be.undefined; // Todo bien sin parametros
    expect(wcConPipe('helloworld.txt', ['-l', '-w', '-c','helloworld.txt'])).to.be.undefined; // Todo bien con parametros
  })
})