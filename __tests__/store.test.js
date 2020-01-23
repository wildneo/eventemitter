import store from '../src/store';

const mockStore = store();
const methods = [
  'set',
  'get',
  'has',
  'clear',
  'remove',
  'getStore',
];

describe('Store methods', () => {
  describe.each(methods)('.%s', (method) => {
    test('Method should be a function', () => {
      expect(mockStore).toHaveProperty(method, expect.any(Function));
    });
  });
});
