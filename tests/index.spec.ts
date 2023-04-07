import 'mocha'
import { expect } from "chai";
import { holaMundo } from "../src/index";

describe('Tests para holaMundo', () => {
  it('Prueba de funcion', () => {
    expect(holaMundo('Hola Mundo')).to.be.eql('Hola Mundo');
  })
})