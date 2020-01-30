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

  describe('/items', () => {
    describe('GET', () => {
      it('responds with a 200 status code and application/json content type', async (done) => {
        let res = await request.get('/items');
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toEqual("application/json; charset=utf-8");
        done();
      });

      it('items from "cache" should be in the response body', async (done) => {
        let cache = find();
        let res = await request.get('/items');
        expect(res.body).toEqual(cache);
        done();
      })
    });
  });

  describe('/checkout', () => {
    let mockCart = { ids: 'AA' }

    describe('POST', () => {
      it('accepts a json object ids & responds with a 200 status code and application/json content type', async (done) => {
        let res = await request.post('/checkout').send(mockCart);
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toEqual("application/json; charset=utf-8");
        done();
      });

      it("should accept an ids string & responds with a total price of items in the body", async (done) => {
        let res = await request.post('/checkout').send(mockCart);
        expect(res.body).toEqual({ 'totalPrice': 4 });
        done();
      });
    })
  })
});
  