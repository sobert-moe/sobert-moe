/**
 * Singleton Design Pattern
 *
 * Intent: Ensures that a class has only one instance, while providing a global
 * access point to this instance.
 */

import { ConsoleLogger, log, LogType, setLogger } from "@moe-tech/policysystem";
setLogger(new ConsoleLogger());

/**
 * The Singleton class defines the `getInstance` method that lets clients access
 * the unique singleton instance.
 */
export class DatabaseConnection {
  private static instance: DatabaseConnection;
  
  private constructor(private host: string, private port: number) {
    // Private constructor to prevent instantiation via 'new' operator
    log(`Creating new DatabaseConnection to ${host}:${port}`, LogType.INFO);
  }

  /**
   * The static method that controls access to the singleton instance.
   */
  public static getInstance(host: string, port: number): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection(host, port);
    } else {
      log("Returning existing connection instance", LogType.INFO);
    }

    return DatabaseConnection.instance;
  }

  /**
   * Business logic methods
   */
  public query(sql: string): unknown[] {
    log(`Executing query: ${sql}`, LogType.INFO);
    // Implementation would go here
    return [];
  }

  public disconnect(): void {
    log("Disconnecting from database", LogType.INFO);
    // Implementation would go here
  }
}

/**
 * Client code example
 */
function clientCode(): void {
  // First instance creation
  const connection1 = DatabaseConnection.getInstance("localhost", 5432);
  connection1.query("SELECT * FROM users");
  
  // Second attempt will return the same instance
  const connection2 = DatabaseConnection.getInstance("localhost", 5432);
  
  // Both variables contain the same instance
  log(`Same instance? ${connection1 === connection2}`, LogType.INFO);
}

// Uncomment to run:
// clientCode();