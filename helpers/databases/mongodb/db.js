const mongoConnection = require('./connection');
const wrapper = require('../../utils/wrapper');
const logger = require('../../utils/logger');
const _ = require('lodash');

class DB {
  constructor(config, dbName) {
    this.config = config;
    this.dbName = dbName;
  }

  setCollection(collectionName) {
    this.collectionName = collectionName;
  }

  async getDatabase() {
    const config = this.config.replace('//', '');
    /* eslint no-useless-escape: "error" */
    const pattern = new RegExp('/([a-zA-Z0-9-_]+)?');
    const dbName = pattern.exec(config);
    return dbName[1];
  }

  async findOne(params, collectionName = this.collectionName) {
    const ctx = 'mongodb-findOne';
    const dbName = this.dbName;
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const db = cacheConnection.collection(this.collectionName);
      const recordset = await db.findOne(params);
      if (_.isEmpty(recordset)) {
        return wrapper.data(null);
      }
      return wrapper.data(recordset);

    } catch (err) {
      logger.log(ctx, err.message, 'Error find data in mongodb');
      return wrapper.error(`Error Find One Mongo ${err.message}`);
    }
  }

  async findMany(params, project = {}, sortParams) {
    const ctx = 'mongodb-findMany';
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const db = cacheConnection.collection(this.collectionName);
      const recordset = await db.find(params, {projection:project}).sort(sortParams).toArray();
      if (_.isEmpty(recordset)) {
        return wrapper.data([]);
      }
      return wrapper.data(recordset);

    } catch (err) {
      logger.log(ctx, err.message, 'Error find data in mongodb');
      return wrapper.error(`Error Find Many Mongo ${err.message}`);
    }
  }

  async insertOne(document) {
    const ctx = 'mongodb-insertOne';
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const db = cacheConnection.collection(this.collectionName);
      const recordset = await db.insertOne(document);
      if (recordset.insertedCount !== 1) {
        return wrapper.error('Failed Inserting Data to Database');
      }
      return wrapper.data(document);

    } catch (err) {
      logger.log(ctx, err.message, 'Error insert data in mongodb');
      return wrapper.error(`Error Insert One Mongo ${err.message}`);
    }
  }

  async updateOne(params, updateDocument) {
    const ctx = 'mongodb-updateOne';
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const db = cacheConnection.collection(this.collectionName);
      const data = await db.updateOne(params, { $set: updateDocument });
      if (data.modifiedCount >= 0) {
        const recordset = await this.findOne(params);
        return wrapper.data(recordset.data);
      }
      return wrapper.error('Failed updating data');
    } catch (err) {
      logger.log(ctx, err.message, 'Error update data in mongodb');
      return wrapper.error(`Error Update Mongo ${err.message}`);
    }
  }

  async deleteOne(params) {
    const ctx = 'mongodb-deleteOne';
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const db = cacheConnection.collection(this.collectionName);
      const data = await db.deleteOne(params);
      if (data.deletedCount > 0) {
        return wrapper.data(true);
      }
      return wrapper.error('Failed deleting data');
    } catch (err) {
      logger.log(ctx, err.message, 'Error upsert data in mongodb');
      return wrapper.error(`Error Upsert Mongo ${err.message}`);
    }
  }
}

module.exports = DB;
