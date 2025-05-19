/**
 * Strategy Design Pattern
 *
 * Intent: Define a family of algorithms, encapsulate each one, and make them
 * interchangeable. Strategy lets the algorithm vary independently from the
 * clients that use it.
 */

import { ConsoleLogger, log, LogType, setLogger } from "@moe-tech/policysystem";
setLogger(new ConsoleLogger());

/**
 * The Strategy interface declares operations common to all supported versions
 * of some algorithm. The Context uses this interface to call the algorithm
 * defined by the ConcreteStrategies.
 */
interface Strategy {
  doAlgorithm(data: string[]): string[];
}

/**
 * The Context defines the interface of interest to clients.
 */
class Context {
  /**
   * @type {Strategy} The Context maintains a reference to one of the Strategy
   * objects. The Context does not know the concrete class of a strategy. It
   * should work with all strategies via the Strategy interface.
   */
  private strategy: Strategy;

  /**
   * Usually, the Context accepts a strategy through the constructor, but also
   * provides a setter to change it at runtime.
   */
  constructor(strategy: Strategy) {
    this.strategy = strategy;
  }

  /**
   * Usually, the Context allows replacing a Strategy object at runtime.
   */
  public setStrategy(strategy: Strategy) {
    this.strategy = strategy;
    log("Strategy has been changed", LogType.INFO);
  }

  /**
   * The Context delegates some work to the Strategy object instead of
   * implementing multiple versions of the algorithm on its own.
   */
  public doSomeBusinessLogic(): void {
    // Some business logic here...
    const data = ["a", "b", "c", "d", "e"];
    log("Context: Sorting data using the strategy", LogType.INFO);
    const result = this.strategy.doAlgorithm(data);
    log(`Result: ${result.join(",")}`, LogType.INFO);
    // More business logic here...
  }
}

/**
 * Concrete Strategies implement the algorithm while following the base Strategy
 * interface. The interface makes them interchangeable in the Context.
 */
class ConcreteStrategyA implements Strategy {
  public doAlgorithm(data: string[]): string[] {
    log("ConcreteStrategyA: Sorting in ascending order", LogType.INFO);
    return data.sort();
  }
}

class ConcreteStrategyB implements Strategy {
  public doAlgorithm(data: string[]): string[] {
    log("ConcreteStrategyB: Sorting in descending order", LogType.INFO);
    return data.sort().reverse();
  }
}

class ConcreteStrategyRandom implements Strategy {
  public doAlgorithm(data: string[]): string[] {
    log("ConcreteStrategyRandom: Random shuffle", LogType.INFO);
    return [...data].sort(() => Math.random() - 0.5);
  }
}

/**
 * Client code demonstration
 */
function strategyDemo(): void {
  log("Client: Let's use Strategy A", LogType.INFO);
  const context = new Context(new ConcreteStrategyA());
  context.doSomeBusinessLogic();

  log("Client: Let's use Strategy B", LogType.INFO);
  context.setStrategy(new ConcreteStrategyB());
  context.doSomeBusinessLogic();

  log("Client: Let's use the Random Strategy", LogType.INFO);
  context.setStrategy(new ConcreteStrategyRandom());
  context.doSomeBusinessLogic();
}

// Uncomment to run:
// strategyDemo();