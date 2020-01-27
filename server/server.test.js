const supertest = require('supertest');
const app = require('./server');
const request = supertest(app);

describe('Route integration', () => {
    describe('/', () => {
      describe('GET', () => {
        it('responds with 200 status and text/html content type', () => {
          let res = request.get('/')
          // expect(res.header).toEqual({'Content-Type': /text\/html/});
          expect(res.status).toBe(200);
        });
      });
    });
});
  