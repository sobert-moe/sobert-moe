/**
 * Builder Design Pattern
 *
 * Intent: Separate the construction of a complex object from its representation,
 * allowing the same construction process to create different representations.
 */

import { ConsoleLogger, log, LogType, setLogger } from "@moe-tech/policysystem";
setLogger(new ConsoleLogger());

/**
 * The Product class defines the type of complex object that will be built.
 * Unlike simpler creational patterns, different concrete builders may produce
 * unrelated products. In other words, results of various builders may not
 * always follow the same interface.
 */
class Product {
  private parts: string[] = [];

  public add(part: string): void {
    this.parts.push(part);
  }

  public listParts(): void {
    log(`Product parts: ${this.parts.join(', ')}`, LogType.INFO);
  }
}

/**
 * The Builder interface specifies methods for creating the different parts of
 * the Product objects.
 */
interface Builder {
  reset(): void;
  buildPartA(): void;
  buildPartB(): void;
  buildPartC(): void;
}

/**
 * The Concrete Builder classes follow the Builder interface and provide
 * specific implementations of the building steps. Your program may have several
 * variations of Builders, implemented differently.
 */
class ConcreteBuilder1 implements Builder {
  private product: Product;

  /**
   * A fresh builder instance should contain a blank product object, which is
   * used in further assembly.
   */
  constructor() {
    this.reset();
  }

  public reset(): void {
    this.product = new Product();
  }

  /**
   * All production steps work with the same product instance.
   */
  public buildPartA(): void {
    this.product.add("PartA1");
    log("ConcreteBuilder1: Part A added", LogType.INFO);
  }

  public buildPartB(): void {
    this.product.add("PartB1");
    log("ConcreteBuilder1: Part B added", LogType.INFO);
  }

  public buildPartC(): void {
    this.product.add("PartC1");
    log("ConcreteBuilder1: Part C added", LogType.INFO);
  }

  /**
   * Concrete Builders are supposed to provide their own methods for
   * retrieving results. That's because various types of builders may create
   * entirely different products that don't follow the same interface.
   * Therefore, such methods cannot be declared in the base Builder interface
   * (at least in a statically typed programming language).
   *
   * Usually, after returning the end result to the client, a builder instance
   * is expected to be ready to start producing another product. That's why
   * it's a usual practice to call the reset method at the end of the
   * `getProduct` method body. However, this behavior is not mandatory, and
   * you can make your builders wait for an explicit reset call from the
   * client code before disposing of the previous result.
   */
  public getProduct(): Product {
    const result = this.product;
    this.reset();
    return result;
  }
}

/**
 * Another concrete builder that builds a different kind of product
 */
class ConcreteBuilder2 implements Builder {
  private product: Product;

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.product = new Product();
  }

  public buildPartA(): void {
    this.product.add("PartA2");
    log("ConcreteBuilder2: Part A added (different implementation)", LogType.INFO);
  }

  public buildPartB(): void {
    this.product.add("PartB2");
    log("ConcreteBuilder2: Part B added (different implementation)", LogType.INFO);
  }

  public buildPartC(): void {
    this.product.add("PartC2");
    log("ConcreteBuilder2: Part C added (different implementation)", LogType.INFO);
  }

  public getProduct(): Product {
    const result = this.product;
    this.reset();
    return result;
  }
}

/**
 * The Director is only responsible for executing the building steps in a
 * particular sequence. It is helpful when producing products according to a
 * specific order or configuration. Strictly speaking, the Director class is
 * optional, since the client can directly control the builders.
 */
class Director {
  private builder: Builder;

  /**
   * The Director works with any builder instance that the client code passes
   * to it. This way, the client code may alter the final type of the newly
   * assembled product.
   */
  public setBuilder(builder: Builder): void {
    this.builder = builder;
  }

  /**
   * The Director can construct several product variations using the same
   * building steps.
   */
  public buildMinimalViableProduct(): void {
    this.builder.buildPartA();
  }

  public buildFullFeaturedProduct(): void {
    this.builder.buildPartA();
    this.builder.buildPartB();
    this.builder.buildPartC();
  }
}

/**
 * Client code using the Builder pattern
 */
function builderDemo(): void {
  log("Client: Testing the standard builder with a director", LogType.INFO);
  const director = new Director();
  const builder1 = new ConcreteBuilder1();
  director.setBuilder(builder1);
  
  log("Client: Standard basic product:", LogType.INFO);
  director.buildMinimalViableProduct();
  builder1.getProduct().listParts();
  
  log("Client: Standard full featured product:", LogType.INFO);
  director.buildFullFeaturedProduct();
  builder1.getProduct().listParts();

  // Remember, the Builder pattern can be used without a Director class.
  log("Client: Custom product without a director", LogType.INFO);
  const builder2 = new ConcreteBuilder2();
  builder2.buildPartA();
  builder2.buildPartC();
  builder2.getProduct().listParts();
}

// Uncomment to run:
// builderDemo();