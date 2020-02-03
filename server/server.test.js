const supertest = require('supertest');
const app = require('./server');
const { find } = require('./db/items');
const request = supertest(app);

describe('Route integration', () => {

  describe('/', () => {
    describe('GET', () => {
      it('responds with a 200 status code and text/html content type', async (done) => {
        let res = await request.get('/');
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toEqual("text/html; charset=UTF-8");
        done();
      });
    });
  });

  describe('/api/items', () => {
    describe('GET', () => {
      it('responds with a 200 status code and application/json content type', async (done) => {
        let res = await request.get('/api/items');
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toEqual("application/json; charset=utf-8");
        done();
      });

      it('items from "cache" should be in the response body', async (done) => {
        let cache = find();
        let res = await request.get('/api/items');
        expect(res.body).toEqual(cache);
        done();
      })
    });
  });
});
  