const { isEmpty } = require('./helper');
const db = require('./items');

describe('Helper Functions & Middlewares', () => {
  describe('isEmpty', () => {
    it('returns true if input is an empty array, empty object, null, or not an object', () => {
      expect(isEmpty([])).toBe(true);
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty({})).toBe(true);
      expect(isEmpty("")).toBe(true);
    });
  })
});

describe('Db Controllers', () => {
  describe('db.find()', () => {
    it('reads a json object & returns a cache', () => {
      const mockCache = {
        A: {
          description: "Apple",
          unit_price: 2.0,
          volume_discounts: [
            { "number": 4, "price": 7.0 }
          ]
        }
      }
      expect(db.find()).toEqual(mockCache);
    });
  });
})