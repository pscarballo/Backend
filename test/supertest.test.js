import chai from 'chai';
import supertest from 'supertest';
import { faker } from '@faker-js/faker';

const expect = chai.expect;
const requester = supertest('http://127.0.0.1:3000/');

describe('Test API', () => {
  describe('ENDPOINT Sessions', () => {
    let cookieName;
    let cookieValue;
    const mockUser = {
      firstName: 'Juan',
      lastName: 'Perez',
      age: 31,
      email: faker.internet.email(),
      password: '123',
    };

    it('Registro', async () => {
      const { _body, statusCode } = await requester.post('api/sessions/register').send(mockUser);
      console.log(_body);
      expect(statusCode).to.be.eql(200);
      expect(_body.payload).to.be.ok;
    });

    it('Logueo', async () => {
      const result = await requester.post('/api/sessions/login').send({
        email: mockUser.email,
        password: mockUser.password,
      });

      const cookie = result.headers['set-cookie'][0];
      expect(cookie).to.be.ok;

      cookieName = cookie.split('=')[0];
      cookieValue = cookie.split('=')[1];

      expect(cookieName).to.be.ok.and.eql('coderCookie');
      expect(cookieValue).to.be.ok;
    });

    // api/user/current
    it('Current User', async () => {
      const { _body } = (await requester.get('api/sessions/current')).setEncoding('Cookie', [`${cookieName}=${cookieValue}`]);
      expect(_body.payload.email).to.be.eql(mockUser.email);
    });
  });

  describe('ENDPOINT Products', () => {
    it('GET', async () => {
      const response = await requester.get('api/products');
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, _body } = response;
      expect(status).to.equal(200);
      expect(_body.payload).to.be.an.instanceof(Array);
    });
    it('POST', async () => {
      const productMock = {
        title: 'Producto Prueba',
        description: 'Zapatilla',
        categoria: 'Zapatilla',
        price: 29.99,
        thumbnail: 'https://ejemplo.com/imagen.jpg',
        code: 1234,
        stock: 10,
      };
      const response = await requester.post('api/products').send(productMock);
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, _body } = response;
      expect(status).to.equal(201);
      expect(_body.payload).to.have.property('_id');
    });
    it('PUT', async () => {
      const productIdToUpdate = '647b6a0c2a2deaefe1fc283c';
      const updatedProductData = {
        title: 'Jordan123',
        description: 'Zapatilla',
        category: 'Zapatilla',
        price: 300,
        thumbnail: './images/img1.jpg',
        code: 1003,
        stock: 100,
      };
      const response = await requester.put(`api/products/${productIdToUpdate}`).send(updatedProductData);
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, _body } = response;
      expect(status).to.equal(201);
      expect(_body.payload).to.have.eql(`Has actualizado el producto con ID ${productIdToUpdate}`);
    });
    it('DELETE', async () => {
      const productIdToDelete = '65064ffdf2d8d7a038ce98ac';
      const response = await requester.delete(`api/products/${productIdToDelete}`);
      if (response.error) {
        throw new Error(response.error.message);
      }
      const { status, _body } = response;
      expect(status).to.equal(200);
      expect(_body.payload).to.have.eql(`Has eliminado el producto con ID ${productIdToDelete}`);
    });
  });
});
