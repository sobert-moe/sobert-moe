/**
 * Facade Design Pattern
 *
 * Intent: Provide a unified interface to a set of interfaces in a subsystem.
 * Facade defines a higher-level interface that makes the subsystem easier to use.
 */

import { ConsoleLogger, log, LogType, setLogger } from "@moe-tech/policysystem";
setLogger(new ConsoleLogger());

/**
 * The Subsystem can accept requests either from the facade or client directly.
 * In any case, to the Subsystem, the Facade is yet another client, and it's not
 * a part of the Subsystem.
 */
class Subsystem1 {
  public operation1(): string {
    log("Subsystem1: Ready!", LogType.INFO);
    return 'Subsystem1: Ready!';
  }

  public operationN(): string {
    log("Subsystem1: Go!", LogType.INFO);
    return 'Subsystem1: Go!';
  }
}

/**
 * Some facades can work with multiple subsystems at the same time.
 */
class Subsystem2 {
  public operation1(): string {
    log("Subsystem2: Get ready!", LogType.INFO);
    return 'Subsystem2: Get ready!';
  }

  public operationZ(): string {
    log("Subsystem2: Fire!", LogType.INFO);
    return 'Subsystem2: Fire!';
  }
}

/**
 * The Facade class provides a simple interface to the complex logic of one or
 * several subsystems. The Facade delegates the client requests to the
 * appropriate objects within the subsystem. The Facade is also responsible for
 * managing their lifecycle. All of this shields the client from the undesired
 * complexity of the subsystem.
 */
class Facade {
  protected subsystem1: Subsystem1;
  protected subsystem2: Subsystem2;

  /**
   * Depending on your application's needs, you can provide the Facade with
   * existing subsystem objects or force the Facade to create them on its own.
   */
  constructor(subsystem1?: Subsystem1, subsystem2?: Subsystem2) {
    this.subsystem1 = subsystem1 || new Subsystem1();
    this.subsystem2 = subsystem2 || new Subsystem2();
  }

  /**
   * The Facade's methods are convenient shortcuts to the sophisticated
   * functionality of the subsystems. However, clients get only to a fraction
   * of a subsystem's capabilities.
   */
  public operation(): string {
    let result = 'Facade initializes subsystems:\n';
    result += this.subsystem1.operation1();
    result += '\n';
    result += this.subsystem2.operation1();
    result += '\n';
    log("Facade orders subsystems to perform the action:", LogType.INFO);
    result += this.subsystem1.operationN();
    result += '\n';
    result += this.subsystem2.operationZ();
    return result;
  }
}

/**
 * A more practical example: HomeTheaterFacade
 */
class DVDPlayer {
  private movie: string = "";
  
  public on(): void {
    log("DVD Player: Powering on", LogType.INFO);
  }
  
  public off(): void {
    log("DVD Player: Powering off", LogType.INFO);
  }
  
  public play(movie: string): void {
    this.movie = movie;
    log(`DVD Player: Playing "${movie}"`, LogType.INFO);
  }
  
  public stop(): void {
    log(`DVD Player: Stopping "${this.movie}"`, LogType.INFO);
    this.movie = "";
  }
  
  public eject(): void {
    log("DVD Player: Ejecting disc", LogType.INFO);
  }
}

class Amplifier {
  private volume: number = 0;
  
  public on(): void {
    log("Amplifier: Powering on", LogType.INFO);
  }
  
  public off(): void {
    log("Amplifier: Powering off", LogType.INFO);
  }
  
  public setVolume(level: number): void {
    this.volume = level;
    log(`Amplifier: Setting volume to ${level}`, LogType.INFO);
  }
  
  public setDvd(): void {
    log("Amplifier: Setting input to DVD player", LogType.INFO);
  }
}

class Projector {
  public on(): void {
    log("Projector: Powering on", LogType.INFO);
  }
  
  public off(): void {
    log("Projector: Powering off", LogType.INFO);
  }
  
  public setInput(input: string): void {
    log(`Projector: Setting input to ${input}`, LogType.INFO);
  }
  
  public wideScreenMode(): void {
    log("Projector: Setting wide screen mode (16:9 aspect ratio)", LogType.INFO);
  }
}

class TheaterLights {
  public on(): void {
    log("Theater Lights: On at full brightness", LogType.INFO);
  }
  
  public dim(level: number): void {
    log(`Theater Lights: Dimming to ${level}%`, LogType.INFO);
  }
}

class Screen {
  public down(): void {
    log("Screen: Going down", LogType.INFO);
  }
  
  public up(): void {
    log("Screen: Going up", LogType.INFO);
  }
}

class PopcornPopper {
  public on(): void {
    log("Popcorn Popper: Turning on", LogType.INFO);
  }
  
  public off(): void {
    log("Popcorn Popper: Turning off", LogType.INFO);
  }
  
  public pop(): void {
    log("Popcorn Popper: Popping popcorn!", LogType.INFO);
  }
}

/**
 * The HomeTheaterFacade class simplifies the complex home theater system.
 */
class HomeTheaterFacade {
  private amplifier: Amplifier;
  private dvdPlayer: DVDPlayer;
  private projector: Projector;
  private lights: TheaterLights;
  private screen: Screen;
  private popper: PopcornPopper;
  
  constructor(
    amplifier: Amplifier,
    dvdPlayer: DVDPlayer,
    projector: Projector,
    lights: TheaterLights,
    screen: Screen,
    popper: PopcornPopper
  ) {
    this.amplifier = amplifier;
    this.dvdPlayer = dvdPlayer;
    this.projector = projector;
    this.lights = lights;
    this.screen = screen;
    this.popper = popper;
  }
  
  public watchMovie(movie: string): void {
    log("=== Home Theater System Starting Up ===", LogType.INFO);
    this.popper.on();
    this.popper.pop();
    
    this.lights.dim(10);
    this.screen.down();
    
    this.projector.on();
    this.projector.setInput("DVD");
    this.projector.wideScreenMode();
    
    this.amplifier.on();
    this.amplifier.setDvd();
    this.amplifier.setVolume(5);
    
    this.dvdPlayer.on();
    this.dvdPlayer.play(movie);
  }
  
  public endMovie(): void {
    log("=== Home Theater System Shutting Down ===", LogType.INFO);
    this.popper.off();
    this.lights.on();
    this.screen.up();
    this.projector.off();
    this.amplifier.off();
    this.dvdPlayer.stop();
    this.dvdPlayer.eject();
    this.dvdPlayer.off();
  }
}

/**
 * The client code works with complex subsystems through a simple interface
 * provided by the Facade.
 */
function clientCode(facade: Facade) {
  log(facade.operation(), LogType.INFO);
}

/**
 * Client code demonstration
 */
function facadeDemo(): void {
  // Basic facade demo
  log("Basic Facade Pattern Demo:", LogType.INFO);
  const subsystem1 = new Subsystem1();
  const subsystem2 = new Subsystem2();
  const facade = new Facade(subsystem1, subsystem2);
  clientCode(facade);
  
  // Home theater facade demo
  log("\nHome Theater Facade Demo:", LogType.INFO);
  
  // Create all the components of the home theater
  const amp = new Amplifier();
  const dvd = new DVDPlayer();
  const projector = new Projector();
  const lights = new TheaterLights();
  const screen = new Screen();
  const popper = new PopcornPopper();
  
  // Create the home theater facade
  const homeTheater = new HomeTheaterFacade(
    amp, dvd, projector, lights, screen, popper
  );
  
  // Use the simplified interface
  homeTheater.watchMovie("The Matrix");
  
  log("\nMovie is playing...\n", LogType.INFO);
  
  homeTheater.endMovie();
}

// Uncomment to run:
// facadeDemo();