class BusinessError extends Error {}

class ValidationError extends BusinessError {
  constructor(cause: string) {
    super(`A validation error has occurred: ${cause}`);
  }
}

export { BusinessError, ValidationError }
