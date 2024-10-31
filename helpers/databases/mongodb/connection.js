const Mongo = require('mongodb').MongoClient;
const wrapper = require('../../utils/wrapper');
const logger = require('../../utils/logger');
const _ = require('lodash');

const connectionPool = [];
const connection = () => {
  return { index: null, config: '', db: null };
};

const createConnection = async (config) => {
  const options = {
    maxPoolSize: 50, // poolSize diubah menjadi maxPoolSize
    socketTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    const connection = await Mongo.connect(config, options);
    return wrapper.data(connection);
  } catch (err) {
    logger.log('connection-createConnection', err, 'error');
    return wrapper.error(err.message);
  }
};

const addConnectionPool = (cfg) => {
  const connectionMongo = connection();
  connectionMongo.index = connectionPool.length; // Set index ke panjang array connectionPool
  connectionMongo.config = cfg;
  if (_.isEmpty(connectionPool.find((obj) => obj.config === cfg))) {
    connectionPool.push(connectionMongo);
  }
};

const createConnectionPool = async () => {
  for (let index = 0; index < connectionPool.length; index++) {
    const currentConnection = connectionPool[index];
    const result = await createConnection(currentConnection.config);
    if (result.err) {
      connectionPool[index].db = null;
    } else {
      connectionPool[index].db = result.data.db("testDB"); // Tambahkan nama DB
    }
  }
};

const init = (cfg) => {
  addConnectionPool(cfg);
  createConnectionPool();
};

const ifExistConnection = async (config) => {
  const state = connectionPool.find((currentConnection) => currentConnection.config === config) || {};
  if (_.isEmpty(state)) {
    return wrapper.error('Connection Not Exist, Connection Must be Created Before');
  }
  return wrapper.data(state);
};

const isConnected = async (state) => {
  const connection = state.db;
  if (_.isEmpty(connection)) {
    return wrapper.error('Connection Not Found, Connection Must be Created Before');
  }
  return wrapper.data(state);
};

const getConnection = async (config) => {
  const result = await ifExistConnection(config);
  if (result.err) {
    // Koneksi tidak ditemukan, buat koneksi baru
    const newConnection = await createConnection(config);
    if (newConnection.err) {
      return newConnection;
    }
    const connectionMongo = connection();
    connectionMongo.config = config;
    connectionMongo.db = newConnection.data.db("testDB");
    connectionPool.push(connectionMongo); // Tambahkan koneksi ke pool
    return wrapper.data(connectionMongo);
  }
  return await isConnected(result.data);
};

module.exports = {
  init,
  getConnection
};
