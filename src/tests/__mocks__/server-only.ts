// Mock for server-only in test environment.
// The actual module throws if imported in a non-server context.
// We intentionally export nothing so callers that check `typeof module !== 'undefined'`
// won't break, and the empty module satisfies the import.
export {};
