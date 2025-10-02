/**
 * Wix Error Handler
 * Adheres to Wix SDK error standard format as per:
 * https://dev.wix.com/docs/sdk/articles/work-with-the-sdk/about-errors
 */

/**
 * Wix Error Types based on official documentation
 */
export interface WixApplicationError {
  code: string;
  description: string;
  data?: any;
}

export interface WixValidationError {
  fieldViolations: Array<{
    field: string;
    description: string;
    violatedRule: string;
    ruleName: string;
    data?: any;
  }>;
}

export interface WixErrorDetails {
  applicationError?: WixApplicationError;
  validationError?: WixValidationError;
}

export interface WixStandardError {
  message: string;
  details?: WixErrorDetails;
}

/**
 * Common Wix error codes
 */
export const WIX_ERROR_CODES = {
  // Application Errors
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  ABORTED: 'ABORTED',
  RESOURCE_EXHAUSTED: 'RESOURCE_EXHAUSTED',
  INVALID_ARGUMENT: 'INVALID_ARGUMENT',
  OUT_OF_RANGE: 'OUT_OF_RANGE',
  FAILED_PRECONDITION: 'FAILED_PRECONDITION',
  INTERNAL: 'INTERNAL',
  UNAVAILABLE: 'UNAVAILABLE',
  DEADLINE_EXCEEDED: 'DEADLINE_EXCEEDED',

  // Booking Specific Errors
  BOOKING_NOT_AVAILABLE: 'BOOKING_NOT_AVAILABLE',
  BOOKING_CONFLICT: 'BOOKING_CONFLICT',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  NO_FUNDS: 'NO_FUNDS',
  INVALID_PAYMENT_METHOD: 'INVALID_PAYMENT_METHOD',
  BOOKING_EXPIRED: 'BOOKING_EXPIRED',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

/**
 * Wix Error Handler Class
 */
export class WixErrorHandler {
  /**
   * Creates a standardized Wix error response
   * @param message - Error message
   * @param code - Error code
   * @param description - Detailed description
   * @param data - Additional error data
   * @returns Wix standard error format
   */
  static createApplicationError(
    message: string,
    code: string,
    description: string,
    data?: any
  ): WixStandardError {
    return {
      message,
      details: {
        applicationError: {
          code,
          description,
          data,
        },
      },
    };
  }

  /**
   * Creates a validation error response
   * @param message - Error message
   * @param fieldViolations - Array of field violations
   * @returns Wix standard error format
   */
  static createValidationError(
    message: string,
    fieldViolations: Array<{
      field: string;
      description: string;
      violatedRule: string;
      ruleName?: string;
      data?: any;
    }>
  ): WixStandardError {
    return {
      message,
      details: {
        validationError: {
          fieldViolations: fieldViolations.map((violation) => ({
            field: violation.field,
            description: violation.description,
            violatedRule: violation.violatedRule,
            ruleName: violation.ruleName || 'VALIDATION_ERROR',
            data: violation.data,
          })),
        },
      },
    };
  }

  /**
   * Creates a system error response
   * @param message - Error message
   * @returns Wix standard error format
   */
  static createSystemError(message: string): WixStandardError {
    return {
      message,
      // System errors are sent empty by design per Wix documentation
    };
  }

  /**
   * Handles Wix SDK errors and converts them to standard format
   * @param error - Error from Wix SDK
   * @returns Wix standard error format
   */
  static handleWixError(error: any): WixStandardError {
    // If error already follows Wix standard format, return as-is
    if (error.message && error.details) {
      return error;
    }

    // Handle different types of errors
    if (error.code) {
      // Application error
      return this.createApplicationError(
        error.message || 'An application error occurred',
        error.code,
        error.description || error.message || 'Unknown application error',
        error.data
      );
    }

    if (error.fieldViolations) {
      // Validation error
      return this.createValidationError(
        error.message || 'Validation failed',
        error.fieldViolations
      );
    }

    // System error or unknown error
    return this.createSystemError(error.message || 'A system error occurred');
  }

  /**
   * Creates booking-specific errors
   */
  static createBookingError(
    code: string,
    description: string,
    data?: any
  ): WixStandardError {
    return this.createApplicationError(
      'Booking operation failed',
      code,
      description,
      data
    );
  }

  /**
   * Creates payment-specific errors
   */
  static createPaymentError(
    code: string,
    description: string,
    data?: any
  ): WixStandardError {
    return this.createApplicationError(
      'Payment operation failed',
      code,
      description,
      data
    );
  }

  /**
   * Creates checkout-specific errors
   */
  static createCheckoutError(
    code: string,
    description: string,
    data?: any
  ): WixStandardError {
    return this.createApplicationError(
      'Checkout operation failed',
      code,
      description,
      data
    );
  }
}

/**
 * Error response helper for API endpoints
 */
export class ApiErrorResponse {
  /**
   * Creates a standardized API error response
   * @param wixError - Wix standard error
   * @param statusCode - HTTP status code
   * @returns NextResponse with error
   */
  static create(wixError: WixStandardError, statusCode: number = 400) {
    return {
      success: false,
      error: wixError.message,
      details: wixError.details,
      statusCode,
    };
  }

  /**
   * Creates a validation error response
   * @param message - Error message
   * @param fieldViolations - Field violations
   * @returns API error response
   */
  static validationError(
    message: string,
    fieldViolations: Array<{
      field: string;
      description: string;
      violatedRule: string;
      ruleName?: string;
      data?: any;
    }>
  ) {
    const wixError = WixErrorHandler.createValidationError(
      message,
      fieldViolations
    );
    return this.create(wixError, 400);
  }

  /**
   * Creates an application error response
   * @param message - Error message
   * @param code - Error code
   * @param description - Error description
   * @param data - Additional data
   * @param statusCode - HTTP status code
   * @returns API error response
   */
  static applicationError(
    message: string,
    code: string,
    description: string,
    data?: any,
    statusCode: number = 400
  ) {
    const wixError = WixErrorHandler.createApplicationError(
      message,
      code,
      description,
      data
    );
    return this.create(wixError, statusCode);
  }

  /**
   * Creates a system error response
   * @param message - Error message
   * @returns API error response
   */
  static systemError(message: string) {
    const wixError = WixErrorHandler.createSystemError(message);
    return this.create(wixError, 500);
  }
}
