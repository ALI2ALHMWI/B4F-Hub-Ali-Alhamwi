export default class HashTable<T> {
  private table: Record<string, T> = {};

  set(key: number | string, value: T): void {
    this.table[String(key)] = value;
  }

  get(key: number | string): T | undefined {
    return this.table[String(key)];
  }

  has(key: number | string): boolean {
    return Object.prototype.hasOwnProperty.call(this.table, String(key));
  }

  clear(): void {
    this.table = {};
  }
}
