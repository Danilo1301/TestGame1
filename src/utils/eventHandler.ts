type Callback = (...args: any[]) => void;

export class EventHandler {
  private events: { [key: string]: Callback[] } = {};

  // Method to listen to an event
  public on(event: string, callback: Callback): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  // Method to emit an event and call all its listeners
  public emit(event: string, ...args: any[]): void {
    const callbacks = this.events[event];
    if (callbacks) {
      callbacks.forEach((callback) => callback(...args));
    }
  }

  // Method to remove a specific callback for an event
  public off(event: string, callback: Callback): void {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }

  // Method to remove all listeners for an event
  public offAll(event: string): void {
    if (this.events[event]) {
      delete this.events[event];
    }
  }
}