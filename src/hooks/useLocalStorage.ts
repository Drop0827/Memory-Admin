import { useStorage } from '@vueuse/core'

/**
 * Reactive LocalStorage.
 * @param key Storage key
 * @param initialValue Initial value
 * @returns Ref
 */
export default function useLocalStorage<T>(key: string, initialValue: T) {
  return useStorage<T>(key, initialValue)
}
