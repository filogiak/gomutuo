type Listener = (...args: any[]) => void;

export class Emitter {
  private listeners: Map<string, Listener[]>;

  constructor() {
    this.listeners = new Map();
  }

  on(event: string, listener: Listener): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }

  off(event: string, listener: Listener): void {
    if (!this.listeners.has(event)) return;
    const listeners = this.listeners.get(event)!;
    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }

  emit(event: string, ...args: any[]): void {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event)!.forEach(listener => listener(...args));
  }

  clear(): void {
    this.listeners.clear();
  }
} 