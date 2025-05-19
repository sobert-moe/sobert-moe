/**
 * State Design Pattern
 *
 * Intent: Allow an object to alter its behavior when its internal state
 * changes. The object will appear to change its class.
 */

import { ConsoleLogger, log, LogType, setLogger } from "@moe-tech/policysystem";
setLogger(new ConsoleLogger());

/**
 * The Context defines the interface of interest to clients. It also maintains a
 * reference to an instance of a State subclass, which represents the current
 * state of the Context.
 */
class Context {
  /**
   * @type {State} A reference to the current state of the Context.
   */
  private state: State;

  /**
   * @param {State} state The initial state of the context.
   */
  constructor(state: State) {
    this.transitionTo(state);
  }

  /**
   * The Context allows changing the State object at runtime.
   */
  public transitionTo(state: State): void {
    log(`Context: Transitioning to ${state.constructor.name}.`, LogType.INFO);
    this.state = state;
    this.state.setContext(this);
  }

  /**
   * The Context delegates part of its behavior to the current State object.
   */
  public request1(): void {
    this.state.handle1();
  }

  public request2(): void {
    this.state.handle2();
  }
}

/**
 * The base State class declares methods that all Concrete State should
 * implement and also provides a back reference to the Context object,
 * associated with the State. This back reference can be used by States to
 * transition the Context to another State.
 */
abstract class State {
  protected context: Context;

  public setContext(context: Context) {
    this.context = context;
  }

  public abstract handle1(): void;

  public abstract handle2(): void;
}

/**
 * Concrete States implement various behaviors, associated with a state of the
 * Context.
 */
class ConcreteStateA extends State {
  public handle1(): void {
    log("ConcreteStateA handles request1.", LogType.INFO);
    log("ConcreteStateA wants to change the state of the context.", LogType.INFO);
    this.context.transitionTo(new ConcreteStateB());
  }

  public handle2(): void {
    log("ConcreteStateA handles request2.", LogType.INFO);
  }
}

class ConcreteStateB extends State {
  public handle1(): void {
    log("ConcreteStateB handles request1.", LogType.INFO);
  }

  public handle2(): void {
    log("ConcreteStateB handles request2.", LogType.INFO);
    log("ConcreteStateB wants to change the state of the context.", LogType.INFO);
    this.context.transitionTo(new ConcreteStateA());
  }
}

/**
 * Real-world example: Document state management
 */
class Document {
  private state: DocumentState;
  private name: string;

  constructor(name: string) {
    this.name = name;
    this.state = new DraftState();
    this.state.setDocument(this);
    log(`Document '${this.name}' created in Draft state.`, LogType.INFO);
  }

  public getName(): string {
    return this.name;
  }

  public changeState(state: DocumentState): void {
    log(`Document '${this.name}': Changing state from ${this.state.constructor.name} to ${state.constructor.name}`, LogType.INFO);
    this.state = state;
    this.state.setDocument(this);
  }

  public publish(): void {
    this.state.publish();
  }

  public review(): void {
    this.state.review();
  }

  public reject(): void {
    this.state.reject();
  }

  public render(): string {
    return this.state.render();
  }
}

abstract class DocumentState {
  protected document: Document;

  public setDocument(document: Document): void {
    this.document = document;
  }

  public abstract publish(): void;
  public abstract review(): void;
  public abstract reject(): void;
  public abstract render(): string;
}

class DraftState extends DocumentState {
  public publish(): void {
    log(`Document '${this.document.getName()}': Cannot publish directly from Draft state.`, LogType.INFO);
    log(`Document '${this.document.getName()}': Sending for moderation first.`, LogType.INFO);
    this.document.changeState(new ModerationState());
  }

  public review(): void {
    log(`Document '${this.document.getName()}': Draft is under review.`, LogType.INFO);
  }

  public reject(): void {
    log(`Document '${this.document.getName()}': Draft cannot be rejected yet. It needs to be reviewed first.`, LogType.INFO);
  }

  public render(): string {
    return "Document is in DRAFT mode (only visible to authors).";
  }
}

class ModerationState extends DocumentState {
  public publish(): void {
    log(`Document '${this.document.getName()}': Cannot publish from Moderation state. Document must be approved first.`, LogType.INFO);
  }

  public review(): void {
    log(`Document '${this.document.getName()}': Document has been reviewed and approved.`, LogType.INFO);
    this.document.changeState(new PublishedState());
  }

  public reject(): void {
    log(`Document '${this.document.getName()}': Document has been rejected.`, LogType.INFO);
    this.document.changeState(new DraftState());
  }

  public render(): string {
    return "Document is in MODERATION mode (visible to moderators).";
  }
}

class PublishedState extends DocumentState {
  public publish(): void {
    log(`Document '${this.document.getName()}': Document is already published.`, LogType.INFO);
  }

  public review(): void {
    log(`Document '${this.document.getName()}': Published document is being reviewed.`, LogType.INFO);
  }

  public reject(): void {
    log(`Document '${this.document.getName()}': Published document has been rejected and unpublished.`, LogType.INFO);
    this.document.changeState(new DraftState());
  }

  public render(): string {
    return "Document is in PUBLISHED mode (visible to everyone).";
  }
}

/**
 * Client code demonstration
 */
function stateDemo(): void {
  log("Basic State Pattern Demo:", LogType.INFO);
  const context = new Context(new ConcreteStateA());
  context.request1();
  context.request2();
  
  log("\nDocument State Management Demo:", LogType.INFO);
  const document = new Document("Design Patterns Article");
  
  log(`Render: ${document.render()}`, LogType.INFO);
  
  document.publish(); // Draft -> Moderation
  log(`Render: ${document.render()}`, LogType.INFO);
  
  document.review();  // Moderation -> Published
  log(`Render: ${document.render()}`, LogType.INFO);
  
  document.publish(); // Already published
  
  document.reject();  // Published -> Draft
  log(`Render: ${document.render()}`, LogType.INFO);
}

// Uncomment to run:
// stateDemo();