/**
 * Observer Design Pattern
 * 
 * Intent: Defines a one-to-many dependency between objects so that when one
 * object changes state, all its dependents are notified and updated automatically.
 */

import { ConsoleLogger, log, LogType, setLogger } from "@moe-tech/policysystem";
setLogger(new ConsoleLogger());

/**
 * The Subject interface declares a set of methods for managing subscribers.
 */
interface Subject {
  // Attach an observer to the subject.
  attach(observer: Observer): void;

  // Detach an observer from the subject.
  detach(observer: Observer): void;

  // Notify all observers about an event.
  notify(): void;
}

/**
 * The Observer interface declares the update method, used by subjects.
 */
interface Observer {
  // Receive update from subject.
  update(subject: Subject): void;
}

/**
 * The Subject owns some important state and notifies observers when the state
 * changes.
 */
class ConcreteSubject implements Subject {
  /**
   * @type {number} For the sake of simplicity, the Subject's state, essential
   * to all subscribers, is stored in this variable.
   */
  public state: number;

  /**
   * @type {Observer[]} List of subscribers. In real life, the list of
   * subscribers can be stored more comprehensively (categorized by event
   * type, etc.).
   */
  private observers: Observer[] = [];

  /**
   * The subscription management methods.
   */
  public attach(observer: Observer): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      log("Subject: Observer has been attached already.", LogType.DEBUG);
      return;
    }

    log("Subject: Attached an observer.", LogType.INFO);
    this.observers.push(observer);
  }

  public detach(observer: Observer): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      log("Subject: Nonexistent observer.", LogType.ERROR);
      return;
    }

    this.observers.splice(observerIndex, 1);
    log("Subject: Detached an observer.", LogType.INFO);
  }

  /**
   * Trigger an update in each subscriber.
   */
  public notify(): void {
    log("Subject: Notifying observers...", LogType.INFO);
    for (const observer of this.observers) {
      observer.update(this);
    }
  }

  /**
   * Usually, the subscription logic is only a fraction of what a Subject can
   * really do. Subjects commonly hold some important business logic, that
   * triggers a notification method whenever something important is about to
   * happen (or after it).
   */
  public someBusinessLogic(): void {
    log("Subject: I'm doing something important.", LogType.INFO);
    this.state = Math.floor(Math.random() * (10 + 1));

    log(`Subject: My state has changed to: ${this.state}`, LogType.INFO);
    this.notify();
  }
}

/**
 * Concrete Observers react to the updates issued by the Subject they had been
 * attached to.
 */
class ConcreteObserverA implements Observer {
  public update(subject: Subject): void {
    if (subject instanceof ConcreteSubject && subject.state < 5) {
      log("ConcreteObserverA: Reacted to the event.", LogType.INFO);
    }
  }
}

class ConcreteObserverB implements Observer {
  public update(subject: Subject): void {
    if (subject instanceof ConcreteSubject && (subject.state === 0 || subject.state >= 2)) {
      log("ConcreteObserverB: Reacted to the event.", LogType.INFO);
    }
  }
}

/**
 * The client code.
 */
function clientCode(): void {
  const subject = new ConcreteSubject();

  const observer1 = new ConcreteObserverA();
  subject.attach(observer1);

  const observer2 = new ConcreteObserverB();
  subject.attach(observer2);

  subject.someBusinessLogic();
  subject.someBusinessLogic();

  subject.detach(observer2);

  subject.someBusinessLogic();
}

// Uncomment to run:
// clientCode();