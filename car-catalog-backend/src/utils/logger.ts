import fs from 'fs';
import path from 'path';

class Logger {
  private logDir: string;
  
  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    this.ensureLogDirectory();
  }

  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private formatMessage(level: string, message: string, ...args: unknown[]): string {
    const timestamp = new Date().toISOString();
    const formattedArgs = args.length > 0 ? ' ' + args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ') : '';
    
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${formattedArgs}`;
  }

  private writeToFile(level: string, message: string): void {
    const today = new Date().toISOString().split('T')[0];
    const logFile = path.join(this.logDir, `${today}.log`);
    const logMessage = this.formatMessage(level, message) + '\n';
    
    fs.appendFileSync(logFile, logMessage);
  }

  info(message: string, ...args: unknown[]): void {
    const formattedMessage = this.formatMessage('info', message, ...args);
    console.log('\x1b[36m%s\x1b[0m', formattedMessage); // Cyan
    this.writeToFile('info', message);
  }

  warn(message: string, ...args: unknown[]): void {
    const formattedMessage = this.formatMessage('warn', message, ...args);
    console.warn('\x1b[33m%s\x1b[0m', formattedMessage); // Yellow
    this.writeToFile('warn', message);
  }

  error(message: string, ...args: unknown[]): void {
    const formattedMessage = this.formatMessage('error', message, ...args);
    console.error('\x1b[31m%s\x1b[0m', formattedMessage); // Red
    this.writeToFile('error', message);
  }

  debug(message: string, ...args: unknown[]): void {
    if (process.env.NODE_ENV === 'development') {
      const formattedMessage = this.formatMessage('debug', message, ...args);
      console.log('\x1b[35m%s\x1b[0m', formattedMessage); // Magenta
      this.writeToFile('debug', message);
    }
  }

  success(message: string, ...args: unknown[]): void {
    const formattedMessage = this.formatMessage('success', message, ...args);
    console.log('\x1b[32m%s\x1b[0m', formattedMessage); // Green
    this.writeToFile('info', message);
  }
}

export const logger = new Logger();