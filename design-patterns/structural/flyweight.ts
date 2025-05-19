/**
 * Flyweight Design Pattern
 *
 * Intent: Use sharing to support large numbers of fine-grained objects
 * efficiently. The pattern can be used to reduce memory usage when you need
 * to create a large number of similar objects.
 */

import { ConsoleLogger, log, LogType, setLogger } from "@moe-tech/policysystem";
setLogger(new ConsoleLogger());

/**
 * The Flyweight stores a common portion of the state (also called intrinsic
 * state) that belongs to multiple real business entities. The Flyweight accepts
 * the rest of the state (extrinsic state, unique for each entity) via its
 * method parameters.
 */
class Flyweight {
  private sharedState: any;

  constructor(sharedState: any) {
    this.sharedState = sharedState;
  }

  public operation(uniqueState: any): void {
    const s = JSON.stringify(this.sharedState);
    const u = JSON.stringify(uniqueState);
    log(`Flyweight: Displaying shared (${s}) and unique (${u}) state.`, LogType.INFO);
  }
}

/**
 * The Flyweight Factory creates and manages the Flyweight objects. It ensures
 * that flyweights are shared correctly. When the client requests a flyweight,
 * the factory either returns an existing instance or creates a new one, if it
 * doesn't exist yet.
 */
class FlyweightFactory {
  private flyweights: {[key: string]: Flyweight} = {};

  constructor(initialFlyweights: string[][]) {
    for (const state of initialFlyweights) {
      this.flyweights[this.getKey(state)] = new Flyweight(state);
    }
  }

  /**
   * Returns a Flyweight's string hash for a given state.
   */
  private getKey(state: string[]): string {
    return state.join('_');
  }

  /**
   * Returns an existing Flyweight with a given state or creates a new one.
   */
  public getFlyweight(sharedState: string[]): Flyweight {
    const key = this.getKey(sharedState);

    if (!(key in this.flyweights)) {
      log(`FlyweightFactory: Can't find a flyweight, creating new one.`, LogType.INFO);
      this.flyweights[key] = new Flyweight(sharedState);
    } else {
      log(`FlyweightFactory: Reusing existing flyweight.`, LogType.INFO);
    }

    return this.flyweights[key];
  }

  public listFlyweights(): void {
    const count = Object.keys(this.flyweights).length;
    log(`\nFlyweightFactory: I have ${count} flyweights:`, LogType.INFO);
    for (const key in this.flyweights) {
      log(key, LogType.INFO);
    }
  }
}

/**
 * The client code usually creates a bunch of pre-populated flyweights in the
 * initialization stage of the application.
 */
const factory = new FlyweightFactory([
  ['Chevrolet', 'Camaro2018', 'pink'],
  ['Mercedes Benz', 'C300', 'black'],
  ['Mercedes Benz', 'C500', 'red'],
  ['BMW', 'M5', 'red'],
  ['BMW', 'X6', 'white'],
]);
factory.listFlyweights();

/**
 * Example usage of the Flyweight pattern with a real-world example: text formatting
 */
interface TextFormatting {
  getFont(): string;
  getSize(): number;
  getColor(): string;
  apply(text: string): void;
}

class FormattingFlyweight implements TextFormatting {
  // Intrinsic state - shared and immutable
  private readonly font: string;
  private readonly size: number;
  private readonly color: string;

  constructor(font: string, size: number, color: string) {
    this.font = font;
    this.size = size;
    this.color = color;
  }

  public getFont(): string {
    return this.font;
  }

  public getSize(): number {
    return this.size;
  }

  public getColor(): string {
    return this.color;
  }

  // Extrinsic state is passed as parameters
  public apply(text: string): void {
    log(`Applying format (${this.font}, ${this.size}, ${this.color}) to text: "${text}"`, LogType.INFO);
  }
}

class TextFormattingFactory {
  private formats: { [key: string]: FormattingFlyweight } = {};

  private getKey(font: string, size: number, color: string): string {
    return `${font}_${size}_${color}`;
  }

  public getFormatting(font: string, size: number, color: string): FormattingFlyweight {
    const key = this.getKey(font, size, color);
    
    if (!(key in this.formats)) {
      log(`TextFormattingFactory: Creating new format for ${font}, ${size}, ${color}`, LogType.INFO);
      this.formats[key] = new FormattingFlyweight(font, size, color);
    } else {
      log(`TextFormattingFactory: Reusing existing format for ${font}, ${size}, ${color}`, LogType.INFO);
    }
    
    return this.formats[key];
  }
  
  public getFormattingCount(): number {
    return Object.keys(this.formats).length;
  }
}

/**
 * Client code demonstration
 */
function flyweightDemo(): void {
  // This client code adds new flyweights to the factory using existing ones
  // which allows them to be reused when appropriate
  function addCarToPoliceDatabase(
    factory: FlyweightFactory,
    plates: string,
    owner: string,
    brand: string,
    model: string,
    color: string,
  ) {
    log("\nClient: Adding a car to the database.", LogType.INFO);
    const flyweight = factory.getFlyweight([brand, model, color]);
    
    // The client code either stores or calculates extrinsic state and passes it
    // to the flyweight's methods
    flyweight.operation([plates, owner]);
  }
  
  // Standard flyweight client usage
  addCarToPoliceDatabase(factory, 'CL234IR', 'James Doe', 'BMW', 'M5', 'red');
  addCarToPoliceDatabase(factory, 'CL789IR', 'Jane Smith', 'BMW', 'X6', 'white');
  factory.listFlyweights();
  
  // Text formatting example
  log("\nText Formatting Flyweight Demo:", LogType.INFO);
  
  const textFactory = new TextFormattingFactory();
  
  // Create and apply multiple text formats
  const header1 = textFactory.getFormatting("Arial", 24, "black");
  const header2 = textFactory.getFormatting("Arial", 20, "black");
  const body = textFactory.getFormatting("Times New Roman", 12, "black");
  const highlight = textFactory.getFormatting("Times New Roman", 12, "red");
  
  header1.apply("Main Document Title");
  header2.apply("Section Title");
  body.apply("This is a regular paragraph with normal formatting.");
  highlight.apply("This important text needs to stand out!");
  body.apply("Back to normal text again.");
  
  // Reuse existing formats
  const anotherHighlight = textFactory.getFormatting("Times New Roman", 12, "red");
  anotherHighlight.apply("More highlighted text, reusing the same flyweight!");
  
  log(`Total distinct text formats created: ${textFactory.getFormattingCount()}`, LogType.INFO);
}

// Uncomment to run:
// flyweightDemo();