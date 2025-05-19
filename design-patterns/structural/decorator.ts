/**
 * Decorator Design Pattern
 *
 * Intent: Attach additional responsibilities to objects dynamically.
 * Decorators provide a flexible alternative to subclassing for extending
 * functionality.
 */

import { ConsoleLogger, log, LogType, setLogger } from "@moe-tech/policysystem";
setLogger(new ConsoleLogger());

/**
 * The base Component interface defines operations that can be altered by
 * decorators.
 */
interface Component {
  operation(): string;
}

/**
 * Concrete Components provide default implementations of the operations.
 */
class ConcreteComponent implements Component {
  public operation(): string {
    return 'ConcreteComponent';
  }
}

/**
 * The base Decorator class follows the same interface as the other components.
 * The primary purpose of this class is to define the wrapping interface for all
 * concrete decorators. The default implementation of the wrapping code might
 * include a field for storing a wrapped component and the means to initialize
 * it.
 */
class Decorator implements Component {
  protected component: Component;

  constructor(component: Component) {
    this.component = component;
  }

  /**
   * The Decorator delegates all work to the wrapped component.
   */
  public operation(): string {
    return this.component.operation();
  }
}

/**
 * Concrete Decorators call the wrapped object and alter its result in some way.
 */
class ConcreteDecoratorA extends Decorator {
  /**
   * Decorators may call parent implementation of the operation, instead of
   * calling the wrapped object directly. This approach simplifies extension
   * of decorator classes.
   */
  public operation(): string {
    log("ConcreteDecoratorA: Adding behavior before delegating", LogType.INFO);
    return `ConcreteDecoratorA(${super.operation()})`;
  }
}

/**
 * Decorators can execute their behavior either before or after the call to a
 * wrapped object.
 */
class ConcreteDecoratorB extends Decorator {
  public operation(): string {
    log("ConcreteDecoratorB: Adding behavior after delegating", LogType.INFO);
    return `ConcreteDecoratorB(${super.operation()})`;
  }
}

/**
 * Performance monitoring decorator that logs execution time
 */
class PerformanceDecorator extends Decorator {
  public operation(): string {
    const startTime = new Date().getTime();
    
    // Call the wrapped component's operation
    const result = super.operation();
    
    const endTime = new Date().getTime();
    const executionTime = endTime - startTime;
    
    log(`PerformanceDecorator: Execution time: ${executionTime}ms`, LogType.INFO);
    
    return result;
  }
}

/**
 * The client code works with all objects using the Component interface. This
 * way it can stay independent of the concrete classes of components it works
 * with.
 */
function clientCode(component: Component) {
  log(`RESULT: ${component.operation()}`, LogType.INFO);
}

/**
 * This way the client code can support both simple components...
 */
function decoratorDemo(): void {
  log("Client: I've got a simple component:", LogType.INFO);
  const simple = new ConcreteComponent();
  clientCode(simple);

  /**
   * ...as well as decorated ones.
   *
   * Note how decorators can wrap not only simple components but the other
   * decorators as well.
   */
  log("Client: Now I've got a decorated component:", LogType.INFO);
  const decorator1 = new ConcreteDecoratorA(simple);
  const decorator2 = new ConcreteDecoratorB(decorator1);
  clientCode(decorator2);

  // Using the performance decorator
  log("Client: Let's add performance monitoring:", LogType.INFO);
  const performanceWrapped = new PerformanceDecorator(decorator2);
  clientCode(performanceWrapped);
}

// Uncomment to run:
// decoratorDemo();