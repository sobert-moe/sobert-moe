/**
 * Proxy Design Pattern
 *
 * Intent: Provide a surrogate or placeholder for another object to control
 * access to it.
 */

import { ConsoleLogger, log, LogType, setLogger } from "@moe-tech/policysystem";
setLogger(new ConsoleLogger());

/**
 * The Subject interface declares common operations for both RealSubject and
 * the Proxy. As long as the client works with RealSubject using this
 * interface, you'll be able to pass it a proxy instead of a real subject.
 */
interface Subject {
  request(): void;
}

/**
 * The RealSubject contains some core business logic. Usually, RealSubjects are
 * capable of doing some useful work which may also be very slow or sensitive -
 * e.g. correcting input data. A Proxy can solve these issues without any
 * changes to the RealSubject's code.
 */
class RealSubject implements Subject {
  public request(): void {
    log("RealSubject: Handling request.", LogType.INFO);
  }
}

/**
 * The Proxy has an interface identical to the RealSubject.
 */
class Proxy implements Subject {
  private realSubject: RealSubject;

  /**
   * The Proxy maintains a reference to an object of the RealSubject class. It
   * can be either lazy-loaded or passed to the Proxy by the client.
   */
  constructor(realSubject: RealSubject) {
    this.realSubject = realSubject;
  }

  /**
   * The most common applications of the Proxy pattern are lazy loading,
   * caching, controlling the access, logging, etc. A Proxy can perform one of
   * these things and then, depending on the result, pass the execution to the
   * same method in a linked RealSubject object.
   */
  public request(): void {
    if (this.checkAccess()) {
      this.realSubject.request();
      this.logAccess();
    }
  }

  private checkAccess(): boolean {
    // Some real checks should go here.
    log("Proxy: Checking access prior to firing a real request.", LogType.INFO);
    return true;
  }

  private logAccess(): void {
    log("Proxy: Logging the time of request.", LogType.INFO);
  }
}

/**
 * The client code is supposed to work with all objects (both subjects and
 * proxies) via the Subject interface in order to support both real subjects and
 * proxies. In real life, however, clients mostly work with their real subjects
 * directly. In this case, to implement the pattern more easily, you can extend
 * your proxy from the real subject's class.
 */
function clientCode(subject: Subject) {
  // ...
  subject.request();
  // ...
}

/**
 * Cache proxy demonstration - a more practical example
 */
class ExpensiveOperationProxy implements Subject {
  private realSubject: RealSubject;
  private cachedResult: any | null = null;

  constructor(realSubject: RealSubject) {
    this.realSubject = realSubject;
  }

  public request(): void {
    if (this.cachedResult === null) {
      log("ExpensiveOperationProxy: No cached result available, delegating to real subject", LogType.INFO);
      this.realSubject.request();
      this.cachedResult = "Result of expensive operation";
      log("ExpensiveOperationProxy: Result cached for future use", LogType.INFO);
    } else {
      log("ExpensiveOperationProxy: Returning cached result, skipping real operation", LogType.INFO);
    }
  }
}

/**
 * Client code demonstration
 */
function proxyDemo(): void {
  log("Client: Executing the client code with a real subject:", LogType.INFO);
  const realSubject = new RealSubject();
  clientCode(realSubject);

  log("", LogType.INFO);

  log("Client: Executing the same client code with a proxy:", LogType.INFO);
  const proxy = new Proxy(realSubject);
  clientCode(proxy);
  
  log("", LogType.INFO);
  
  log("Client: Demonstrating caching with ExpensiveOperationProxy:", LogType.INFO);
  const cacheProxy = new ExpensiveOperationProxy(realSubject);
  
  log("First call - should delegate to real subject:", LogType.INFO);
  cacheProxy.request();
  
  log("Second call - should use cached result:", LogType.INFO);
  cacheProxy.request();
}

// Uncomment to run:
// proxyDemo();