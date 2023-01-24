/**
 * Logging interface for the model generation library
 */
export interface ModelLoggingInterface {
  debug(message?: any, ...optionalParams: any[]): void;
  info(message?: any, ...optionalParams: any[]): void;
  warn(message?: any, ...optionalParams: any[]): void;
  error(message?: any, ...optionalParams: any[]): void;
}

/**
 * Logger class for the model generation library
 *
 * This class acts as a forefront for any external loggers which is why it also implements the interface itself.
 */
export class LoggerClass implements ModelLoggingInterface {
  private logger?: ModelLoggingInterface = undefined;

  debug(message?: any, ...optionalParams: any[]): void {
    if (this.logger) {
      this.logger.debug(message, ...optionalParams);
    }
  }
  info(message?: any, ...optionalParams: any[]): void {
    if (this.logger) {
      this.logger.info(message, ...optionalParams);
    }
  }
  warn(message?: any, ...optionalParams: any[]): void {
    if (this.logger) {
      this.logger.warn(message, ...optionalParams);
    }
  }
  error(message?: any, ...optionalParams: any[]): void {
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
