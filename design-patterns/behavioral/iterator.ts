/**
 * Iterator Design Pattern
 *
 * Intent: Provide a way to access the elements of an aggregate object
 * sequentially without exposing its underlying representation.
 */

import { ConsoleLogger, log, LogType, setLogger } from "@moe-tech/policysystem";
setLogger(new ConsoleLogger());

/**
 * Iterator Interface: declares the core iterator operations
 */
interface Iterator<T> {
  // Return the current element
  current(): T;
  
  // Return the current element and move forward to next element
  next(): T;
  
  // Return whether there are more elements to iterate
  hasNext(): boolean;
  
  // Rewind the Iterator to the first element
  rewind(): void;
}

/**
 * Collection Interface: declares one or multiple methods for getting iterators
 * compatible with the collection
 */
interface Aggregator {
  // Get an Iterator instance for the collection
  getIterator(): Iterator<string>;
}

/**
 * Concrete Iterators implement various traversal algorithms.
 * These classes store the current traversal position.
 */
class AlphabeticalOrderIterator implements Iterator<string> {
  private collection: WordsCollection;
  private position: number = 0;
  private reverse: boolean = false;

  constructor(collection: WordsCollection, reverse: boolean = false) {
    this.collection = collection;
    this.reverse = reverse;

    if (reverse) {
      this.position = collection.getCount() - 1;
    }
  }

  public rewind(): void {
    this.position = this.reverse ? this.collection.getCount() - 1 : 0;
    log(`Iterator: Rewind position to ${this.position}`, LogType.INFO);
  }

  public current(): string {
    const item = this.collection.getItems()[this.position];
    log(`Iterator: Current item is '${item}'`, LogType.INFO);
    return item;
  }

  public next(): string {
    const item = this.collection.getItems()[this.position];
    this.position += this.reverse ? -1 : 1;
    log(`Iterator: Moving to next, position is now ${this.position}`, LogType.INFO);
    return item;
  }

  public hasNext(): boolean {
    const result = this.reverse
      ? this.position >= 0
      : this.position < this.collection.getCount();
    
    log(`Iterator: Has next? ${result}`, LogType.INFO);
    return result;
  }
}

/**
 * Concrete Collections provide one or several methods for retrieving fresh
 * iterator instances, compatible with the collection class.
 */
class WordsCollection implements Aggregator {
  private items: string[] = [];

  public getItems(): string[] {
    return this.items;
  }

  public getCount(): number {
    return this.items.length;
  }

  public addItem(item: string): void {
    this.items.push(item);
    log(`Collection: Added item '${item}'`, LogType.INFO);
  }

  public getIterator(): Iterator<string> {
    log("Collection: Creating new forward iterator", LogType.INFO);
    return new AlphabeticalOrderIterator(this);
  }

  public getReverseIterator(): Iterator<string> {
    log("Collection: Creating new reverse iterator", LogType.INFO);
    return new AlphabeticalOrderIterator(this, true);
  }
}

/**
 * Generic Iterator implementation for arrays
 */
class ArrayIterator<T> implements Iterator<T> {
  private array: T[];
  private position: number = 0;

  constructor(array: T[]) {
    this.array = array;
  }

  public current(): T {
    const item = this.array[this.position];
    log(`ArrayIterator: Current item at position ${this.position}`, LogType.INFO);
    return item;
  }

  public next(): T {
    const item = this.array[this.position];
    this.position += 1;
    log(`ArrayIterator: Moving to next, position is now ${this.position}`, LogType.INFO);
    return item;
  }

  public hasNext(): boolean {
    const result = this.position < this.array.length;
    log(`ArrayIterator: Has next? ${result}`, LogType.INFO);
    return result;
  }

  public rewind(): void {
    this.position = 0;
    log("ArrayIterator: Rewind position to 0", LogType.INFO);
  }
}

/**
 * For tree structures, we can implement more complex iterators like depth-first
 */
class TreeNode<T> {
  public value: T;
  public children: TreeNode<T>[] = [];

  constructor(value: T) {
    this.value = value;
  }

  public add(child: TreeNode<T>): void {
    this.children.push(child);
    log("TreeNode: Added new child node", LogType.INFO);
  }
}

class DepthFirstIterator<T> implements Iterator<TreeNode<T>> {
  private tree: TreeNode<T>;
  private stack: TreeNode<T>[] = [];
  private currentNode: TreeNode<T> | null = null;

  constructor(tree: TreeNode<T>) {
    this.tree = tree;
    this.stack.push(tree);
  }

  public current(): TreeNode<T> {
    if (this.currentNode === null) {
      throw new Error('No current element!');
    }
    log("DepthFirstIterator: Returning current node", LogType.INFO);
    return this.currentNode;
  }

  public next(): TreeNode<T> {
    if (!this.hasNext()) {
      throw new Error('No more elements!');
    }

    const node = this.stack.pop();
    this.currentNode = node !== undefined ? node : null;
    
    // Push all children in reverse order so they come out in the correct order
    if (this.currentNode) {
      for (let i = this.currentNode.children.length - 1; i >= 0; i--) {
        this.stack.push(this.currentNode.children[i]);
      }
      log("DepthFirstIterator: Moving to next node", LogType.INFO);
      return this.currentNode;
    }
    
    throw new Error('Unexpected error in iterator');
  }

  public hasNext(): boolean {
    const result = this.stack.length > 0;
    log(`DepthFirstIterator: Has next? ${result}`, LogType.INFO);
    return result;
  }

  public rewind(): void {
    this.stack = [this.tree];
    this.currentNode = null;
    log("DepthFirstIterator: Iterator rewound to start", LogType.INFO);
  }
}

/**
 * The client code may or may not know about the Concrete Iterator or Collection
 * classes, depending on the level of indirection you want to keep in your
 * program.
 */
function iteratorDemo(): void {
  // Simple collection iterator demo
  log("Iterator Pattern Demo 1: Word Collection", LogType.INFO);
  const collection = new WordsCollection();
  collection.addItem('First');
  collection.addItem('Second');
  collection.addItem('Third');

  log("Traversing forward:", LogType.INFO);
  const iterator = collection.getIterator();
  while (iterator.hasNext()) {
    log(iterator.next(), LogType.INFO);
  }

  log("Traversing backward:", LogType.INFO);
  const reverseIterator = collection.getReverseIterator();
  while (reverseIterator.hasNext()) {
    log(reverseIterator.next(), LogType.INFO);
  }

  // Array iterator demo
  log("\nIterator Pattern Demo 2: Generic Array Iterator", LogType.INFO);
  const numbers = [1, 2, 3, 4, 5];
  const arrayIterator = new ArrayIterator(numbers);
  
  log("Iterating over numbers array:", LogType.INFO);
  while (arrayIterator.hasNext()) {
    const num = arrayIterator.next();
    log(`Current number: ${num}`, LogType.INFO);
  }

  // Tree with depth-first iterator demo
  log("\nIterator Pattern Demo 3: Tree with Depth-First Iterator", LogType.INFO);
  const root = new TreeNode('Root');
  const node1 = new TreeNode('Node 1');
  const node2 = new TreeNode('Node 2');
  
  const node11 = new TreeNode('Node 1.1');
  const node12 = new TreeNode('Node 1.2');
  const node21 = new TreeNode('Node 2.1');
  
  node1.add(node11);
  node1.add(node12);
  node2.add(node21);
  
  root.add(node1);
  root.add(node2);

  const treeIterator = new DepthFirstIterator(root);
  log("Depth-first traversal of the tree:", LogType.INFO);
  while (treeIterator.hasNext()) {
    const node = treeIterator.next();
    log(`Visited node with value: ${node.value}`, LogType.INFO);
  }
}

// Uncomment to run:
// iteratorDemo();