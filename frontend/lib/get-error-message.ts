export function getErrorMessage(error: unknown): string {
  // Check if the error is a standard Error object and return its message
  if (error instanceof Error) {
    return error.message;
  }
  // Check if the error is a string literal
  if (typeof error === 'string') {
    return error;
  }
  // Fallback for other types (e.g., numbers, or complex non-Error objects)
  try {
    return JSON.stringify(error);
  } catch {
    // If stringification fails (e.g., circular references)
    return 'An unknown error occurred';
  }
}