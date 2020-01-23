import store from './store';

export default class EventEmitter {
  constructor() {
    this.store = store();
  }

  // Add a listeners for a given event.
  on(event, ...listeners) {
    listeners.forEach((listener) => {
      this.addListener(event, listener);
    });

    return this;
  }

  // Add a one-time listeners for a given event.
  once(event, ...listeners) {
    listeners.forEach((listener) => {
      this.addListener(event, listener, true);
    });

    return this;
  }

  // Calls each of the listeners registered for a given event.
  emit(event, ...args) {
    if (!this.store.has(event)) {
      return this;
    }
    const listeners = this.store.get(event);
    listeners.forEach(({ listener }) => listener.apply(this, args));

    // Remove one-time events
    const filtered = listeners.filter(({ single }) => !single);

    // Delete empty event
    // if (filtered.length === 0) {
    //   this.removeEvent(event);

    //   return this;
    // }

    this.store.set(event, filtered);

    return this;
  }

  // Add a listener for a given event.
  addListener(event, listener, single = false) {
    if (typeof event !== 'string') {
      throw new Error('The event must be a string');
    }
    if (typeof listener !== 'function') {
      throw new Error('The listener must be a function');
    }
    if (typeof single !== 'boolean') {
      throw new Error('The single must be a boolean');
    }

    const newListener = { listener, single };
    if (this.store.has(event)) {
      const listeners = this.store.get(event);
      this.store.set(event, [...listeners, newListener]);

      return this;
    }
    this.store.set(event, [newListener]);

    return this;
  }

  // Remove the listener of a given event.
  removeListener(event, listener) {
    const filtered = this.store
      .get(event)
      .filter((e) => e.listener !== listener);

    // Delete empty event
    // if (filtered.length === 0) {
    //   this.removeEvent(event);

    //   return this;
    // }

    this.store.set(event, filtered);

    return this;
  }

  // Alias for removeListener.
  off(event, listener) {
    return this.removeListener(event, listener);
  }

  // Remove the specified event and all its listeners.
  removeEvent(event) {
    this.store.remove(event);

    return this;
  }

  clear() {
    return this.store.clear();
  }

  // Return object that contains all emitter listners.
  static getListeners(emitter) {
    return emitter.store.getStore();
  }
}
