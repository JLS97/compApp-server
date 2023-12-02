import mongoose, { Connection } from "mongoose";

export interface MongoDBDatabaseParams {
  connectionUrl: string;
}

export abstract class MongoDBDatabase {
  protected _connection: Connection;
  protected _connectionUrl: string;

  constructor(params: MongoDBDatabaseParams){
    this._connectionUrl = params.connectionUrl;
    this.connect();
  }

  connect() {
    if (!this._connection) {
      this._connection = mongoose.createConnection(this._connectionUrl);
    }

    return this._connection;
  }

  async disconnect() {
    await this._connection.close();
  }
  
  getConnection(): Connection {
    return this._connection;
  }
}