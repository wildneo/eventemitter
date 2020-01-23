import EventEmitter from '../src/eventemitter';

const allMethods = [
  'addListener',
  'on',
  'once',
  'emit',
  'removeListener',
  'off',
  'removeEvent',
  'clear',
];

describe('Emitter methods', () => {
  const ee = new EventEmitter();
  const mockFn = jest.fn();
  const events = ['someEvent', 'constructor'];

  afterEach(() => {
    ee.clear();
    jest.restoreAllMocks();
  });

  describe.each(allMethods)('.%s', (method) => {
    test('Method should be a function', () => {
      expect(ee).toHaveProperty(method, expect.any(Function));
    });
  });
  describe.each(['on', 'once', 'addListener'])('.%s', (method) => {
    test('Should register handlers for any type strings', () => {
      const spy = jest.spyOn(ee, method);
      const single = method === 'once';
      const [event1, event2] = events;
      const expected = {
        [event1]: [{ listener: mockFn, single }],
        [event2]: [{ listener: mockFn, single }],
      };
      ee[method](event1, mockFn);
      ee[method](event2, mockFn);
      expect(spy).toHaveBeenCalledTimes(2);
      expect(EventEmitter.getListeners(ee)).toEqual(expected);
    });
  });
  describe('.once', () => {
    test('Should be called once', () => {
      const spy = jest.spyOn(ee, 'emit');
      const event = 'someEvent';
      ee.once(event, mockFn);
      ee.emit(event);
      ee.emit(event);
      expect(spy).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
  describe('.emit', () => {
    test('Should invoke handler for type', () => {
      const event = 'someEvent';
      const arg1 = [];
      const arg2 = {};
      ee.on(event, mockFn);
      ee.emit(event, arg1, arg2);
      expect(mockFn).toBeCalledWith(arg1, arg2);
    });
  });
  describe.each(['removeListener', 'off'])('.%s', (method) => {
    test('Should remove handler for type', () => {
      const [event] = events;
      const expected1 = { [event]: [{ listener: mockFn, single: false }] };
      const expected2 = { [event]: [] };
      ee.on(event, mockFn);
      expect(EventEmitter.getListeners(ee)).toEqual(expected1);
      ee[method](event, mockFn);
      expect(EventEmitter.getListeners(ee)).toEqual(expected2);
    });
  });
  describe('.removeEvent', () => {
    test('Should remove type', () => {
      const [event1, event2] = events;
      const expected1 = {
        [event1]: [{ listener: mockFn, single: false }],
        [event2]: [{ listener: mockFn, single: false }],
      };
      const expected2 = { [event2]: [{ listener: mockFn, single: false }] };
      ee.on(event1, mockFn);
      ee.on(event2, mockFn);
      expect(EventEmitter.getListeners(ee)).toEqual(expected1);
      ee.removeEvent(event1, mockFn);
      expect(EventEmitter.getListeners(ee)).toEqual(expected2);
    });
  });
  describe('.clear', () => {
    test('Should remove all types', () => {
      const [event1, event2] = events;
      const expected = {
        [event1]: [{ listener: mockFn, single: false }],
        [event2]: [{ listener: mockFn, single: false }],
      };
      ee.on(event1, mockFn);
      ee.on(event2, mockFn);
      expect(EventEmitter.getListeners(ee)).toEqual(expected);
      ee.clear();
      expect(EventEmitter.getListeners(ee)).toEqual({});
    });
  });
});
