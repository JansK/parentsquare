const { MongoMemoryServer } = require('mongodb-memory-server');

async function createMongoMemoryServer() {
    return await MongoMemoryServer.create();
}

module.exports = {
  createMongoMemoryServer
};