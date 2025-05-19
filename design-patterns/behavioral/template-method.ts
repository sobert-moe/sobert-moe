/**
 * Template Method Design Pattern
 *
 * Intent: Define the skeleton of an algorithm in an operation, deferring some
 * steps to subclasses. Template Method lets subclasses redefine certain steps of
 * an algorithm without changing the algorithm's structure.
 */

import { ConsoleLogger, log, LogType, setLogger } from "@moe-tech/policysystem";
setLogger(new ConsoleLogger());

/**
 * The Abstract Class defines a template method that contains a skeleton of some
 * algorithm, composed of calls to (usually) abstract primitive operations.
 *
 * Concrete subclasses should implement these operations, but leave the template
 * method itself intact.
 */
abstract class AbstractClass {
  /**
   * The template method defines the skeleton of an algorithm.
   */
  public templateMethod(): void {
    log("AbstractClass: Starting template method", LogType.INFO);
    this.baseOperation1();
    this.requiredOperations1();
    this.baseOperation2();
    this.hook1();
    this.requiredOperation2();
    this.baseOperation3();
    this.hook2();
    log("AbstractClass: Template method completed", LogType.INFO);
  }

  /**
   * These operations already have implementations.
   */
  protected baseOperation1(): void {
    log("AbstractClass: Doing base operation 1", LogType.INFO);
  }

  protected baseOperation2(): void {
    log("AbstractClass: Doing base operation 2", LogType.INFO);
  }

  protected baseOperation3(): void {
    log("AbstractClass: Doing base operation 3", LogType.INFO);
  }

  /**
   * These operations have to be implemented in subclasses.
   */
  protected abstract requiredOperations1(): void;

  protected abstract requiredOperation2(): void;

  /**
   * These are "hooks." Subclasses may override them, but it's not mandatory
   * since the hooks already have default (but empty) implementation. Hooks
   * provide additional extension points in some crucial places of the algorithm.
   */
  protected hook1(): void { }

  protected hook2(): void { }
}

/**
 * Concrete classes have to implement all abstract operations of the base class.
 * They can also override some operations with a default implementation.
 */
class ConcreteClass1 extends AbstractClass {
  protected requiredOperations1(): void {
    log("ConcreteClass1: Implemented Operation1", LogType.INFO);
  }

  protected requiredOperation2(): void {
    log("ConcreteClass1: Implemented Operation2", LogType.INFO);
  }
}

/**
 * Usually, concrete classes override only a fraction of base class' operations.
 */
class ConcreteClass2 extends AbstractClass {
  protected requiredOperations1(): void {
    log("ConcreteClass2: Implemented Operation1 differently", LogType.INFO);
  }

  protected requiredOperation2(): void {
    log("ConcreteClass2: Implemented Operation2 differently", LogType.INFO);
  }

  protected hook1(): void {
    log("ConcreteClass2: Overridden Hook1", LogType.INFO);
  }
}

/**
 * The client code calls the template method to execute the algorithm. Client
 * code does not have to know the concrete class of an object it works with, as
 * long as it works with objects through the interface of their base class.
 */
function clientCode(abstractClass: AbstractClass) {
  // ...
  abstractClass.templateMethod();
  // ...
}

/**
 * Client code demonstration
 */
function templateMethodDemo(): void {
  log("Client: Running the template method with ConcreteClass1:", LogType.INFO);
  clientCode(new ConcreteClass1());
  
  log("\n", LogType.INFO);
  
  log("Client: Running the template method with ConcreteClass2:", LogType.INFO);
  clientCode(new ConcreteClass2());
}

// Uncomment to run:
// templateMethodDemo();