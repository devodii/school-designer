export const stringifyObjectValues = (obj: Record<string, any>) => {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, JSON.stringify(value)]))
}

/**
 * JSON.parse with type inference
 */
export const parseJSON = <T>(str: any): T | null => {
  try {
    return JSON.parse(str) as T
  } catch {
    return null as T
  }
}
