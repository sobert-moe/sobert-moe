/**
 * Composite Design Pattern
 *
 * Intent: Compose objects into tree structures to represent part-whole
 * hierarchies. Composite lets clients treat individual objects and compositions
 * of objects uniformly.
 */

import { ConsoleLogger, log, LogType, setLogger } from "@moe-tech/policysystem";
setLogger(new ConsoleLogger());

/**
 * The base Component class declares common operations for both simple and
 * complex objects of a composition.
 */
abstract class Component {
  protected parent: Component;

  /**
   * Optionally, the base Component can declare an interface for setting and
   * accessing a parent of the component in a tree structure. It can also
   * provide some default implementation for these methods.
   */
  public setParent(parent: Component) {
    this.parent = parent;
  }

  public getParent(): Component {
    return this.parent;
  }

  /**
   * In some cases, it would be beneficial to define the child-management
   * operations right in the base Component class. This way, you won't need to
   * expose any concrete component classes to the client code, even during the
   * object tree assembly. The downside is that these methods will be empty
   * for the leaf-level components.
   */
  public add(component: Component): void { }

  public remove(component: Component): void { }

  /**
   * You can provide a method that lets the client code figure out whether a
   * component can have children.
   */
  public isComposite(): boolean {
    return false;
  }

  /**
   * The base Component may implement some default behavior or leave it to
   * concrete classes (by declaring the method containing the behavior as
   * "abstract").
   */
  public abstract operation(): string;
}

/**
 * The Leaf class represents the end objects of a composition. A leaf can't have
 * any children.
 *
 * Usually, it's the Leaf objects that do the actual work, whereas Composite
 * objects only delegate to their sub-components.
 */
class Leaf extends Component {
  private name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }
  
  public operation(): string {
    return `Leaf ${this.name}`;
  }
}

/**
 * The Composite class represents the complex components that may have children.
 * Usually, the Composite objects delegate the actual work to their children and
 * then "sum-up" the result.
 */
class Composite extends Component {
  protected children: Component[] = [];
  private name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }

  /**
   * A composite object can add or remove other components (both simple or
   * complex) to or from its child list.
   */
  public add(component: Component): void {
    this.children.push(component);
    component.setParent(this);
    log(`Added ${component.operation()} to ${this.name}`, LogType.INFO);
  }

  public remove(component: Component): void {
    const componentIndex = this.children.indexOf(component);
    this.children.splice(componentIndex, 1);
    component.setParent(null);
    log(`Removed ${component.operation()} from ${this.name}`, LogType.INFO);
  }

  public isComposite(): boolean {
    return true;
  }

  /**
   * The Composite executes its primary logic in a particular way. It
   * traverses recursively through all its children, collecting and summing
   * their results. Since the composite's children pass these calls to their
   * children and so forth, the whole object tree is traversed as a result.
   */
  public operation(): string {
    const results = [];
    for (const child of this.children) {
      results.push(child.operation());
    }

    return `Branch(${this.name}): [${results.join('+')}]`;
  }
}

/**
 * The client code works with all of the components via the base interface.
 */
function clientCode(component: Component) {
  log(`RESULT: ${component.operation()}`, LogType.INFO);
}

/**
 * Thanks to the fact that the child-management operations are declared in the
 * base Component class, the client code can work with any component, simple or
 * complex, without depending on their concrete classes.
 */
function clientCode2(component1: Component, component2: Component) {
  if (component1.isComposite()) {
    component1.add(component2);
  }
  log(`RESULT: ${component1.operation()}`, LogType.INFO);
}

/**
 * This way the client code can support the simple leaf components...
 */
function compositeDemo(): void {
  const leaf = new Leaf("Simple");
  log("Client: I've got a simple component:", LogType.INFO);
  clientCode(leaf);

  // ...as well as the complex composites.
  const tree = new Composite("Complex");

  const branch1 = new Composite("Branch1");
  branch1.add(new Leaf("Leaf1"));
  branch1.add(new Leaf("Leaf2"));

  const branch2 = new Composite("Branch2");
  branch2.add(new Leaf("Leaf3"));

  tree.add(branch1);
  tree.add(branch2);

  log("Client: Now I've got a composite tree:", LogType.INFO);
  clientCode(tree);

  log("Client: I don't need to check the components classes even when managing the tree:", LogType.INFO);
  clientCode2(tree, leaf);
}

// Uncomment to run:
// compositeDemo();