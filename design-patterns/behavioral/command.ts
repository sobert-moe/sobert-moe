/**
 * Command Design Pattern
 *
 * Intent: Turn a request into a stand-alone object that contains all information
 * about the request. This transformation lets you pass requests as method arguments,
 * delay or queue a request's execution, and support undoable operations.
 */

import { ConsoleLogger, log, LogType, setLogger } from "@moe-tech/policysystem";
setLogger(new ConsoleLogger());

/**
 * The Command interface declares a method for executing a command.
 */
interface Command {
  execute(): void;
  undo(): void;
}

/**
 * Some commands can implement simple operations on their own.
 */
class SimpleCommand implements Command {
  private payload: string;

  constructor(payload: string) {
    this.payload = payload;
  }

  public execute(): void {
    log(`SimpleCommand: See, I can do simple things like printing (${this.payload})`, LogType.INFO);
  }

  public undo(): void {
    log(`SimpleCommand: Undoing action with payload (${this.payload})`, LogType.INFO);
  }
}

/**
 * However, some commands can delegate more complex operations to other objects,
 * called "receivers."
 */
class ComplexCommand implements Command {
  private receiver: Receiver;

  /**
   * Context data, required for launching the receiver's methods.
   */
  private a: string;
  private b: string;

  /**
   * Complex commands can accept one or several receiver objects along with
   * any context data via the constructor.
   */
  constructor(receiver: Receiver, a: string, b: string) {
    this.receiver = receiver;
    this.a = a;
    this.b = b;
  }

  /**
   * Commands can delegate to any methods of a receiver.
   */
  public execute(): void {
    log("ComplexCommand: Complex stuff should be done by a receiver object.", LogType.INFO);
    this.receiver.doSomething(this.a);
    this.receiver.doSomethingElse(this.b);
  }

  public undo(): void {
    log("ComplexCommand: Undoing complex stuff.", LogType.INFO);
    this.receiver.undoSomething(this.a);
    this.receiver.undoSomethingElse(this.b);
  }
}

/**
 * The Receiver classes contain some important business logic. They know how to
 * perform all kinds of operations, associated with carrying out a request. In
 * fact, any class may serve as a Receiver.
 */
class Receiver {
  public doSomething(a: string): void {
    log(`Receiver: Working on (${a})`, LogType.INFO);
  }

  public doSomethingElse(b: string): void {
    log(`Receiver: Also working on (${b})`, LogType.INFO);
  }

  public undoSomething(a: string): void {
    log(`Receiver: Undoing action on (${a})`, LogType.INFO);
  }

  public undoSomethingElse(b: string): void {
    log(`Receiver: Undoing another action on (${b})`, LogType.INFO);
  }
}

/**
 * The Invoker is associated with one or several commands. It sends a request to
 * the command.
 */
class Invoker {
  private onStart: Command | undefined;
  private onFinish: Command | undefined;
  private history: Command[] = [];

  /**
   * Initialize commands.
   */
  public setOnStart(command: Command): void {
    this.onStart = command;
  }

  public setOnFinish(command: Command): void {
    this.onFinish = command;
  }

  /**
   * The Invoker does not depend on concrete command or receiver classes. The
   * Invoker passes a request to a receiver indirectly, by executing a
   * command.
   */
  public doSomethingImportant(): void {
    log("Invoker: Does anybody want something done before I begin?", LogType.INFO);
    if (this.onStart) {
      this.onStart.execute();
      this.history.push(this.onStart);
    }

    log("Invoker: ...doing something really important...", LogType.INFO);

    log("Invoker: Does anybody want something done after I finish?", LogType.INFO);
    if (this.onFinish) {
      this.onFinish.execute();
      this.history.push(this.onFinish);
    }
  }

  /**
   * Undo the last operation
   */
  public undo(): void {
    const command = this.history.pop();
    if (command) {
      log("Invoker: Undoing last command", LogType.INFO);
      command.undo();
    } else {
      log("Invoker: No commands to undo", LogType.INFO);
    }
  }
}

/**
 * Client code demo
 */
function commandDemo(): void {
  log("Client: Let's set up the invoker with simple and complex commands", LogType.INFO);
  
  const invoker = new Invoker();
  invoker.setOnStart(new SimpleCommand("Say Hi!"));
  
  const receiver = new Receiver();
  invoker.setOnFinish(new ComplexCommand(receiver, "Send email", "Save report"));

  invoker.doSomethingImportant();
  
  // Demonstrate undo functionality
  log("Client: Now let's try undoing operations", LogType.INFO);
  invoker.undo(); // Undo the ComplexCommand
  invoker.undo(); // Undo the SimpleCommand
  invoker.undo(); // Nothing to undo
}

// Uncomment to run:
// commandDemo();