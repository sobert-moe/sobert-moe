/**
 * Adapter Design Pattern
 * 
 * Intent: Allows objects with incompatible interfaces to collaborate.
 */

import { ConsoleLogger, log, LogType, setLogger } from "@moe-tech/policysystem";
setLogger(new ConsoleLogger());

/**
 * The Target defines the domain-specific interface used by the client code.
 */
interface Target {
  request(): string;
}

/**
 * The Adaptee contains some useful behavior, but its interface is incompatible
 * with the existing client code. The Adaptee needs some adaptation before the
 * client code can use it.
 */
class Adaptee {
  public specificRequest(): string {
    return '.eetpadA eht fo roivaheb laicepS';
  }
}

/**
 * The Adapter makes the Adaptee's interface compatible with the Target's
 * interface.
 */
class Adapter implements Target {
  private adaptee: Adaptee;

  constructor(adaptee: Adaptee) {
    this.adaptee = adaptee;
  }

  public request(): string {
    const result = this.adaptee.specificRequest().split('').reverse().join('');
    log(`Adapter: (TRANSLATED) ${result}`, LogType.INFO);
    return result;
  }
}

/**
 * The client code supports all classes that follow the Target interface.
 */
function clientCode(target: Target) {
  log(`Client: I can work just fine with the Target objects:`, LogType.INFO);
  log(target.request(), LogType.INFO);
}

/**
 * Usage example:
 */
function adapterDemo(): void {
  log('Client: I can work with Target objects:', LogType.INFO);
  const target = {
    request(): string {
      return 'Target: The default target\'s behavior.';
    }
  };
  clientCode(target);

  const adaptee = new Adaptee();
  log('Client: The Adaptee class has a weird interface. See, I don\'t understand it:', LogType.INFO);
  log(`Adaptee: ${adaptee.specificRequest()}`, LogType.INFO);

  log('Client: But I can work with it via the Adapter:', LogType.INFO);
  const adapter = new Adapter(adaptee);
  clientCode(adapter);
}

// Uncomment to run:
// adapterDemo();