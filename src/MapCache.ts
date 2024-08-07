export class MapCache<K, V> {
  public readonly map: Map<K, V>;

  constructor(pairs: (readonly [K, V])[] = []) {
    this.map = new Map(pairs);
  }
}
