function deepSafeParse<T>(item: unknown): T {
  try {
    if (typeof item === "string") {
      return deepSafeParse(JSON.parse(item)); // Parse the string and recursively process it
    } else if (typeof item === "object" && item !== null) {
      if (Array.isArray(item)) {
        // Recursively process each item in the array
        return item.map((element) => deepSafeParse(element)) as unknown as T;
      } else {
        // Recursively process each key-value pair in the object
        return Object.entries(item).reduce((acc, [key, value]) => {
          (acc as Record<string, unknown>)[key] = deepSafeParse(value);
          return acc;
        }, {} as Record<string, unknown>) as T;
      }
    }
    return item as T; // Return as-is if not a string or object
  } catch {
    return item as T; // Return as-is if parsing fails
  }
}

export { deepSafeParse };
