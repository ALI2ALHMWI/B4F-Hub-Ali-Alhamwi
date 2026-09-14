export default class HashSet<T> {
  private items = new Set<T>();

  add(value: T): void {
    this.items.add(value);
  }

  delete(value: T): void {
    this.items.delete(value);
  }

  has(value: T): boolean {
    return this.items.has(value);
  }

  clear(): void {
    this.items.clear();
  }

  get size(): number {
    return this.items.size;
  }
}
