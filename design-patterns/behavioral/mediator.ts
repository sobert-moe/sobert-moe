/**
 * Mediator Design Pattern
 *
 * Intent: Define an object that encapsulates how a set of objects interact.
 * Mediator promotes loose coupling by keeping objects from referring to each
 * other explicitly, and it lets you vary their interaction independently.
 */

import { ConsoleLogger, log, LogType, setLogger } from "@moe-tech/policysystem";
setLogger(new ConsoleLogger());

/**
 * The Mediator interface declares a method used by components to notify the
 * mediator about various events. The Mediator may react to these events and
 * pass the execution to other components.
 */
interface Mediator {
  notify(sender: object, event: string): void;
}

/**
 * Concrete Mediators implement cooperative behavior by coordinating several
 * components.
 */
class ConcreteMediator implements Mediator {
  private component1: Component1;
  private component2: Component2;

  constructor(c1: Component1, c2: Component2) {
    this.component1 = c1;
    this.component1.setMediator(this);
    this.component2 = c2;
    this.component2.setMediator(this);
  }

  public notify(sender: object, event: string): void {
    if (event === 'A') {
      log("Mediator reacts to A and triggers following operations:", LogType.INFO);
      this.component2.doC();
    }

    if (event === 'D') {
      log("Mediator reacts to D and triggers following operations:", LogType.INFO);
      this.component1.doB();
      this.component2.doC();
    }
  }
}

/**
 * The Base Component provides the basic functionality of storing a mediator's
 * instance inside component objects.
 */
class BaseComponent {
  protected mediator: Mediator;

  constructor(mediator?: Mediator) {
    this.mediator = mediator;
  }

  public setMediator(mediator: Mediator): void {
    this.mediator = mediator;
  }
}

/**
 * Concrete Components implement various functionality. They don't depend on
 * other components. They also don't depend on any concrete mediator classes.
 */
class Component1 extends BaseComponent {
  public doA(): void {
    log("Component 1 does A.", LogType.INFO);
    this.mediator.notify(this, 'A');
  }

  public doB(): void {
    log("Component 1 does B.", LogType.INFO);
  }
}

class Component2 extends BaseComponent {
  public doC(): void {
    log("Component 2 does C.", LogType.INFO);
  }

  public doD(): void {
    log("Component 2 does D.", LogType.INFO);
    this.mediator.notify(this, 'D');
  }
}

/**
 * Real-world example: Chat room mediator
 */
interface User {
  getName(): string;
  send(message: string): void;
  receive(sender: string, message: string): void;
  setChatRoom(chatRoom: ChatRoomMediator): void;
}

interface ChatRoomMediator {
  register(user: User): void;
  send(message: string, sender: User): void;
}

class ChatUser implements User {
  private name: string;
  private chatRoom: ChatRoomMediator;

  constructor(name: string) {
    this.name = name;
  }

  public getName(): string {
    return this.name;
  }

  public send(message: string): void {
    log(`${this.name} sends: ${message}`, LogType.INFO);
    this.chatRoom.send(message, this);
  }

  public receive(sender: string, message: string): void {
    log(`${this.name} received message from ${sender}: ${message}`, LogType.INFO);
  }

  public setChatRoom(chatRoom: ChatRoomMediator): void {
    this.chatRoom = chatRoom;
  }
}

class ChatRoom implements ChatRoomMediator {
  private users: Map<string, User> = new Map();

  public register(user: User): void {
    if (!this.users.has(user.getName())) {
      this.users.set(user.getName(), user);
      user.setChatRoom(this);
      log(`ChatRoom: ${user.getName()} joined the chat room.`, LogType.INFO);
    }
  }

  public send(message: string, sender: User): void {
    log(`ChatRoom: Dispatching message from ${sender.getName()}`, LogType.INFO);
    // Distribute message to all users except the sender
    this.users.forEach((user, userName) => {
      if (userName !== sender.getName()) {
        user.receive(sender.getName(), message);
      }
    });
  }

  public sendDirectMessage(message: string, sender: User, receiverName: string): void {
    const receiver = this.users.get(receiverName);
    if (receiver) {
      log(`ChatRoom: Sending direct message from ${sender.getName()} to ${receiverName}`, LogType.INFO);
      receiver.receive(sender.getName(), message);
    } else {
      log(`ChatRoom: User ${receiverName} not found`, LogType.ERROR);
    }
  }
}

/**
 * Client code demonstration for basic mediator
 */
function mediatorDemo(): void {
  log("Basic Mediator Pattern Demo:", LogType.INFO);
  // The client code.
  const c1 = new Component1();
  const c2 = new Component2();
  const mediator = new ConcreteMediator(c1, c2);

  log("Client triggers operation A.", LogType.INFO);
  c1.doA();

  log("Client triggers operation D.", LogType.INFO);
  c2.doD();

  // Chat room example
  log("\nChat Room Mediator Demo:", LogType.INFO);
  const chatRoom = new ChatRoom();
  
  const alice = new ChatUser("Alice");
  const bob = new ChatUser("Bob");
  const charlie = new ChatUser("Charlie");

  chatRoom.register(alice);
  chatRoom.register(bob);
  chatRoom.register(charlie);

  alice.send("Hello everyone!");
  bob.send("Hi Alice, welcome to the chat!");
}

// Uncomment to run:
// mediatorDemo();