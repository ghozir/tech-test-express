const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app.js');
const { ObjectId } = require('mongodb');

describe('User API Endpoint Tests', () => {

  context('POST /api/', () => {
    it('should create a new user', async () => {
      const user = {
        name: 'Elfin',
        address: 'Jl. Merdeka',
        status: 'active',
        email: 'ghozi.rabbani@gmail.com'
      };

      const response = await request(app)
        .post('/api/')
        .send(user);

      expect(response.statusCode).to.equal(201);
      expect(response.body).to.have.property('message', 'success create user');
      expect(response.body).to.have.property('code', 201);
    });
  });

  context('GET /api/all', () => {
    it('should get user', async () => {
      const response = await request(app)
        .get('/api/all')

      expect(response.statusCode).to.equal(201);
      expect(response.body).to.have.property('message', 'get all data user');
      expect(response.body).to.have.property('code', 201);
    });
  });

  context('PUT /api/update/:idUser', () => {
    it('should update user', async () => {
      const user = new ObjectId();

      const userUpdate = {
        name: 'Elfin',
        address: 'Jl. Merdeka',
        status: 'active'
      };

      const response = await request(app)
        .put(`/api/update/${user}`)
        .send(userUpdate)

      expect(response.statusCode).to.equal(200);
      expect(response.body).to.have.property('message', 'update user');
      expect(response.body).to.have.property('code', 200);
    });
  });

  context('DELETE /api/delete/:idUser', () => {
    it('should delete user', async () => {
      const user = new ObjectId();

      const response = await request(app)
        .delete(`/api/delete/${user}`)

      expect(response.statusCode).to.equal(200);
      expect(response.body).to.have.property('message', 'delete user');
      expect(response.body).to.have.property('code', 200);
    });
  });

});
