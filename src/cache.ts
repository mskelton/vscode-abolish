const _cache = new Map<string, any>()

export function cache<T>(key: string, fn: () => T): T {
  if (!_cache.has(key)) {
    _cache.set(key, fn())
  }

  return _cache.get(key)
}

cache.clear = () => {
  _cache.clear()
}
