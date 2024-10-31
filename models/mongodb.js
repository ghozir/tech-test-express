
const Mongo = require('../helpers/databases/mongodb/db');

class Command {

  constructor() {
    /**
     * @typedef {import('../helpers/databases/mongodb/db')} DB
     * @type {DB}
     */
    this.db = new Mongo(`mongodb://ghozi-admin:Todayis22@projectdb-shard-00-00.ej6nm.mongodb.net:27017,projectdb-shard-00-01.ej6nm.mongodb.net:27017,projectdb-shard-00-02.ej6nm.mongodb.net:27017/?replicaSet=atlas-dbjsuv-shard-0&ssl=true&authSource=admin`, 'testDB');
  }

  async insertData(document) {
    this.db.setCollection('dataUser');
    const result = await this.db.insertOne(document);
    return result;
  }

  async getAll(params) {
    this.db.setCollection('dataUser');
    const result = await this.db.findMany(params);
    return result;
  }

  async updateData(params,document) {
    this.db.setCollection('dataUser');
    const result = await this.db.updateOne(params,document);
    return result;
  }

  async deleteUser(params) {
    this.db.setCollection('dataUser');
    const result = await this.db.deleteOne(params);
    return result;
  }

}

module.exports = Command;