import 'mocha'
import { expect } from "chai";
import { wcSinPipe } from "../../src/ejercicio-2/wcSinPipe";

describe('Tests para wcSinPipe', () => {
  it('Prueba de wcSinPipe', () => {
    expect(wcSinPipe('hello.txt', ['hello.txt'])).to.be.undefined; // Fichero no existe
    expect(wcSinPipe('helloworld.txt', ['helloworld.txt'])).to.be.undefined; // Todo bien sin parametros
    expect(wcSinPipe('helloworld.txt', ['-l', '-w', '-c','helloworld.txt'])).to.be.undefined; // Todo bien con parametros
  })
})