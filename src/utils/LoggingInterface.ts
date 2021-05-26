
/**
 * Logging interface for the model generation library
 */
export interface ModelLoggingInterface {
  debug(message?: unknown, ...optionalParams: unknown[]): void;
  info(message?: unknown, ...optionalParams: unknown[]): void;
  warn(message?: unknown, ...optionalParams: unknown[]): void;
  error(message?: unknown, ...optionalParams: unknown[]): void;
}

/**
 * Logger class for the model generation library
 * 
 * This class acts as a forefront for any external loggers which is why it also implements the interface itself.
 */
export class LoggerClass implements ModelLoggingInterface {
  private logger?: ModelLoggingInterface = undefined;

  debug(message?: unknown, ...optionalParams: unknown[]): void {
    if (this.logger) {
      this.logger.debug(message, ...optionalParams);
    }
  }
  info(message?: unknown, ...optionalParams: unknown[]): void {
    if (this.logger) {
      this.logger.info(message, ...optionalParams);
    }
  }
  warn(message?: unknown, ...optionalParams: unknown[]): void {
    if (this.logger) {
      this.logger.warn(message, ...optionalParams);
    }
  }
  error(message?: unknown, ...optionalParams: unknown[]): void {
    if (this.logger) {
      this.logger.error(message, ...optionalParams);
    }
  }

  /**
   * Sets the logger to use for the model generation library
   * 
   * @param logger to add
   */
  setLogger(logger?: ModelLoggingInterface): void {
    this.logger = logger;
  }
}

export const Logger: LoggerClass = new LoggerClass();
