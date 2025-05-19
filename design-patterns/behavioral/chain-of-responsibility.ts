/**
 * Chain of Responsibility Design Pattern
 *
 * Intent: Pass a request along a chain of handlers. Upon receiving a request,
 * each handler decides either to process the request or to pass it to the next
 * handler in the chain.
 */

import { ConsoleLogger, log, LogType, setLogger } from "@moe-tech/policysystem";
setLogger(new ConsoleLogger());

/**
 * The Handler interface declares a method for building the chain of handlers.
 * It also declares a method for executing a request.
 */
interface Handler {
  setNext(handler: Handler): Handler;
  handle(request: string): string | null;
}

/**
 * The default chaining behavior can be implemented inside a base handler class.
 */
abstract class AbstractHandler implements Handler {
  private nextHandler: Handler | undefined;

  public setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    // Return a handler from here to enable chaining:
    // monkey.setNext(squirrel).setNext(dog);
    return handler;
  }

  public handle(request: string): string | null {
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }
    return null;
  }
}

/**
 * All Concrete Handlers either handle a request or pass it to the next handler
 * in the chain.
 */
class MonkeyHandler extends AbstractHandler {
  public handle(request: string): string | null {
    if (request === 'Banana') {
      log(`MonkeyHandler: I'll eat the ${request}`, LogType.INFO);
      return `Monkey: I'll eat the ${request}.`;
    }
    log(`MonkeyHandler: I don't eat ${request}, passing along`, LogType.INFO);
    return super.handle(request);
  }
}

class SquirrelHandler extends AbstractHandler {
  public handle(request: string): string | null {
    if (request === 'Nut') {
      log(`SquirrelHandler: I'll eat the ${request}`, LogType.INFO);
      return `Squirrel: I'll eat the ${request}.`;
    }
    log(`SquirrelHandler: I don't eat ${request}, passing along`, LogType.INFO);
    return super.handle(request);
  }
}

class DogHandler extends AbstractHandler {
  public handle(request: string): string | null {
    if (request === 'MeatBall') {
      log(`DogHandler: I'll eat the ${request}`, LogType.INFO);
      return `Dog: I'll eat the ${request}.`;
    }
    log(`DogHandler: I don't eat ${request}, passing along`, LogType.INFO);
    return super.handle(request);
  }
}

/**
 * The client code is usually suited to work with a single handler. In most
 * cases, it is not even aware that the handler is part of a chain.
 */
function clientCode(handler: Handler) {
  const foods = ['Nut', 'Banana', 'Cup of coffee', 'MeatBall'];

  for (const food of foods) {
    log(`Client: Who wants a ${food}?`, LogType.INFO);

    const result = handler.handle(food);
    if (result) {
      log(`  ${result}`, LogType.INFO);
    } else {
      log(`  ${food} was left untouched.`, LogType.INFO);
    }
  }
}

/**
 * A more practical example: logging levels
 */
enum LogLevel {
  INFO = 1,
  DEBUG = 2,
  ERROR = 3
}

abstract class LoggerHandler implements Handler {
  protected level: LogLevel;
  private nextHandler: Handler | undefined;

  constructor(level: LogLevel) {
    this.level = level;
  }

  public setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  public handle(request: string): string | null {
    const [levelStr, message] = request.split(':', 2);
    const level = Number(levelStr);

    if (level >= this.level) {
      return this.log(message);
    }

    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }

    return null;
  }

  protected abstract log(message: string): string;
}

class ConsoleInfoLogger extends LoggerHandler {
  constructor() {
    super(LogLevel.INFO);
  }

  protected log(message: string): string {
    const result = `ConsoleInfoLogger: ${message}`;
    log(result, LogType.INFO);
    return result;
  }
}

class FileDebugLogger extends LoggerHandler {
  constructor() {
    super(LogLevel.DEBUG);
  }

  protected log(message: string): string {
    const result = `FileDebugLogger: ${message}`;
    log(result, LogType.DEBUG);
    return result;
  }
}

class EmailErrorLogger extends LoggerHandler {
  constructor() {
    super(LogLevel.ERROR);
  }

  protected log(message: string): string {
    const result = `EmailErrorLogger: ${message}`;
    log(result, LogType.ERROR);
    return result;
  }
}

/**
 * Client code demonstration
 */
function chainOfResponsibilityDemo(): void {
  log("Chain of Responsibility Demo: Animal Food Chain", LogType.INFO);

  // Setup the chain: MonkeyHandler -> SquirrelHandler -> DogHandler
  const monkey = new MonkeyHandler();
  const squirrel = new SquirrelHandler();
  const dog = new DogHandler();

  monkey.setNext(squirrel).setNext(dog);
  
  // The client should be able to send a request to any handler, not just the
  // first one in the chain
  log("Chain: Monkey > Squirrel > Dog\n", LogType.INFO);
  clientCode(monkey);
  log("", LogType.INFO);

  log("Subchain: Squirrel > Dog\n", LogType.INFO);
  clientCode(squirrel);

  // Logger chain example
  log("\nChain of Responsibility Demo: Logger Chain", LogType.INFO);
  const infoLogger = new ConsoleInfoLogger();
  const debugLogger = new FileDebugLogger();
  const errorLogger = new EmailErrorLogger();

  infoLogger.setNext(debugLogger).setNext(errorLogger);

  log("\nChain: InfoLogger > DebugLogger > ErrorLogger", LogType.INFO);
  
  // These are received by the first logger in the chain
  infoLogger.handle("1:This is an info message");
  
  // This goes to the second logger
  infoLogger.handle("2:This is a debug message");
  
  // This goes to the third logger
  infoLogger.handle("3:This is an error message");
  
  // This doesn't match any level
  infoLogger.handle("0:This won't be logged");
}

// Uncomment to run:
// chainOfResponsibilityDemo();