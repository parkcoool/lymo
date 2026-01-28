export const logObject = (obj: unknown, stringTruncateLength = 100) => {
  const truncateStrings = (value: unknown): unknown => {
    if (typeof value === "string") {
      return value.length > stringTruncateLength
        ? value.slice(0, stringTruncateLength) + "..."
        : value;
    }

    if (Array.isArray(value)) {
      return value.map(truncateStrings);
    }

    if (value !== null && typeof value === "object") {
      const result: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(value)) {
        result[key] = truncateStrings(val);
      }
      return result;
    }

    return value;
  };

  const truncated = truncateStrings(obj);
  console.log(JSON.stringify(truncated, null, 2));
};
