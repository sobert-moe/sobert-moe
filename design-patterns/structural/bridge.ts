/**
 * Bridge Design Pattern
 *
 * Intent: Decouple an abstraction from its implementation so that the two can
 * vary independently.
 */

import { ConsoleLogger, log, LogType, setLogger } from "@moe-tech/policysystem";
setLogger(new ConsoleLogger());

/**
 * The Implementation defines the interface for all implementation classes. It
 * doesn't have to match the Abstraction's interface. In fact, the two
 * interfaces can be entirely different. Typically the Implementation interface
 * provides only primitive operations, while the Abstraction defines higher-
 * level operations based on those primitives.
 */
interface Implementation {
  operationImplementation(): string;
}

/**
 * Each Concrete Implementation corresponds to a specific platform and
 * implements the Implementation interface using that platform's API.
 */
class ConcreteImplementationA implements Implementation {
  public operationImplementation(): string {
    log("ConcreteImplementationA: The result in platform A.", LogType.INFO);
    return 'ConcreteImplementationA: The result in platform A.';
  }
}

class ConcreteImplementationB implements Implementation {
  public operationImplementation(): string {
    log("ConcreteImplementationB: The result in platform B.", LogType.INFO);
    return 'ConcreteImplementationB: The result in platform B.';
  }
}

/**
 * The Abstraction defines the interface for the "control" part of the two class
 * hierarchies. It maintains a reference to an object of the Implementation
 * hierarchy and delegates all of the real work to this object.
 */
class Abstraction {
  protected implementation: Implementation;

  constructor(implementation: Implementation) {
    this.implementation = implementation;
  }

  public operation(): string {
    const result = this.implementation.operationImplementation();
    return `Abstraction: Base operation with:\n${result}`;
  }
}

/**
 * You can extend the Abstraction without changing the Implementation classes.
 */
class ExtendedAbstraction extends Abstraction {
  public operation(): string {
    const result = this.implementation.operationImplementation();
    return `ExtendedAbstraction: Extended operation with:\n${result}`;
  }
}

/**
 * Real-world example: Device and RemoteControl
 */
// Implementation part
interface Device {
  isEnabled(): boolean;
  enable(): void;
  disable(): void;
  getVolume(): number;
  setVolume(percent: number): void;
  getChannel(): number;
  setChannel(channel: number): void;
}

// Concrete implementations
class Tv implements Device {
  private on: boolean = false;
  private volume: number = 30;
  private channel: number = 1;

  public isEnabled(): boolean {
    return this.on;
  }

  public enable(): void {
    this.on = true;
    log("TV: Powered on", LogType.INFO);
  }

  public disable(): void {
    this.on = false;
    log("TV: Powered off", LogType.INFO);
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(percent: number): void {
    if (percent > 100) {
      this.volume = 100;
    } else if (percent < 0) {
      this.volume = 0;
    } else {
      this.volume = percent;
    }
    log(`TV: Volume set to ${this.volume}%`, LogType.INFO);
  }

  public getChannel(): number {
    return this.channel;
  }

  public setChannel(channel: number): void {
    this.channel = channel;
    log(`TV: Channel set to ${this.channel}`, LogType.INFO);
  }
}

class Radio implements Device {
  private on: boolean = false;
  private volume: number = 20;
  private channel: number = 1; // FM frequency like 101.1 could be represented as 1011

  public isEnabled(): boolean {
    return this.on;
  }

  public enable(): void {
    this.on = true;
    log("Radio: Powered on", LogType.INFO);
  }

  public disable(): void {
    this.on = false;
    log("Radio: Powered off", LogType.INFO);
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(percent: number): void {
    if (percent > 100) {
      this.volume = 100;
    } else if (percent < 0) {
      this.volume = 0;
    } else {
      this.volume = percent;
    }
    log(`Radio: Volume set to ${this.volume}%`, LogType.INFO);
  }

  public getChannel(): number {
    return this.channel;
  }

  public setChannel(channel: number): void {
    this.channel = channel;
    log(`Radio: Station set to ${this.channel / 10}.${this.channel % 10} FM`, LogType.INFO);
  }
}

// Abstraction part
class RemoteControl {
  protected device: Device;

  constructor(device: Device) {
    this.device = device;
  }

  public togglePower(): void {
    log("Remote: Power button pressed", LogType.INFO);
    if (this.device.isEnabled()) {
      this.device.disable();
    } else {
      this.device.enable();
    }
  }

  public volumeDown(): void {
    log("Remote: Volume down button pressed", LogType.INFO);
    this.device.setVolume(this.device.getVolume() - 10);
  }

  public volumeUp(): void {
    log("Remote: Volume up button pressed", LogType.INFO);
    this.device.setVolume(this.device.getVolume() + 10);
  }

  public channelDown(): void {
    log("Remote: Channel down button pressed", LogType.INFO);
    this.device.setChannel(this.device.getChannel() - 1);
  }

  public channelUp(): void {
    log("Remote: Channel up button pressed", LogType.INFO);
    this.device.setChannel(this.device.getChannel() + 1);
  }
}

// Extended abstraction
class AdvancedRemoteControl extends RemoteControl {
  public mute(): void {
    log("Advanced Remote: Mute button pressed", LogType.INFO);
    this.device.setVolume(0);
  }

  // Additional methods for the advanced remote
  public setChannel(channel: number): void {
    log(`Advanced Remote: Setting channel directly to ${channel}`, LogType.INFO);
    this.device.setChannel(channel);
  }
}

/**
 * The client code should be able to work with any pre-configured abstraction-
 * implementation combination.
 */
function clientCode(abstraction: Abstraction) {
  // ...
  log(abstraction.operation(), LogType.INFO);
  // ...
}

/**
 * Client code demonstration
 */
function bridgeDemo(): void {
  // Basic bridge pattern demo
  log("Basic Bridge Pattern Demo:", LogType.INFO);
  
  let implementation = new ConcreteImplementationA();
  let abstraction = new Abstraction(implementation);
  clientCode(abstraction);

  implementation = new ConcreteImplementationB();
  abstraction = new ExtendedAbstraction(implementation);
  clientCode(abstraction);

  // Real-world example demonstration
  log("\nDevice-Remote Bridge Pattern Demo:", LogType.INFO);
  
  const tv = new Tv();
  const radio = new Radio();
  
  const tvRemote = new RemoteControl(tv);
  const advancedTvRemote = new AdvancedRemoteControl(tv);
  const radioRemote = new RemoteControl(radio);
  
  log("Testing TV with basic remote:", LogType.INFO);
  tvRemote.togglePower();
  tvRemote.channelUp();
  tvRemote.volumeUp();
  tvRemote.togglePower();
  
  log("\nTesting TV with advanced remote:", LogType.INFO);
  advancedTvRemote.togglePower();
  advancedTvRemote.setChannel(50);
  advancedTvRemote.mute();
  advancedTvRemote.togglePower();
  
  log("\nTesting Radio with basic remote:", LogType.INFO);
  radioRemote.togglePower();
  radioRemote.channelUp();
  radioRemote.volumeDown();
  radioRemote.togglePower();
}

// Uncomment to run:
// bridgeDemo();