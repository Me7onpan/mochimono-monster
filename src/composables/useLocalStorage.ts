import { ref, watch, type Ref } from 'vue'

export function useLocalStorage<T>(key: string, fallback: T): Ref<T> {
  let initial = fallback
  try {
    const saved = localStorage.getItem(key)
    if (saved) initial = JSON.parse(saved) as T
  } catch { /* Use a safe default when storage is unavailable. */ }
  const value = ref(initial) as Ref<T>
  watch(value, (next) => localStorage.setItem(key, JSON.stringify(next)), { deep: true })
  return value
}
