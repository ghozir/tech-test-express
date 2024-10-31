const { Kafka, CompressionTypes } = require('kafkajs');
const logger = require('../../utils/logger');
const config = require('../../../infra/configs/global_config');
const { Partitioners } = require('kafkajs');
const { InternalServerError } = require('../../error');
const ctx = 'events::kafka';

let kafkaInstance;
let kafkaProducer;
let kafkaConsumers = [];
const listTopics = Object.values(config.get('/kafkaTopics'));

const createConnection = ({ clientId, brokers, sasl }) => {
  try {
    return new Kafka({
      clientId,
      brokers,
      ...sasl.mechanism && { sasl },
      retry: {
        initialRetryTime: 100,
        retries: 5
      }
    });
  } catch (error) {
    logger.error(ctx, error?.message, 'createConnection', error?.stack);
    throw error;
  }
};

const createTopics = async (kafka = kafkaInstance, topics = listTopics) => {
  try {
    const admin = kafka.admin();
    await admin.connect();
    const existingTopics = await admin.listTopics();
    // check if every topics in this group is already created or not
    if (!topics.every(topic => existingTopics.includes(topic))) {
      await admin.createTopics({
        topics: topics.map(topic => ({
          topic,
          numPartitions: 1,
          replicationFactor: 1
        }))
      });
    }
    await admin.disconnect();
  } catch (error) {
    logger.error(ctx, error?.message, 'createTopics', error?.stack);
  }
};

const init = async () => {
  try {
    kafkaInstance = createConnection(config.get('/kafkaConfig'));
    if (!kafkaProducer) {
      kafkaProducer = kafkaInstance.producer({ createPartitioner: Partitioners.DefaultPartitioner });
      await kafkaProducer.connect();
    }
    return kafkaInstance;
  } catch (error) {
    logger.error(ctx, error?.message, 'init', error?.stack);
  }
};

/**
 *
 * @param {{topic: String, body: Object}} data
 * @returns
 */
const kafkaSendProducer = async (data) => {
  try {
    if (!kafkaProducer) {
      throw new InternalServerError('kafka producer not connected');
    }

    const buffer = Buffer.from(JSON.stringify(data.body));
    const result = await kafkaProducer.send({
      topic: data.topic,
      compression: CompressionTypes.GZIP,
      messages: [
        { value: buffer }
      ],
    });
    return result;
  } catch (error) {
    logger.error(ctx, error?.message, 'kafkaSendProducer', error?.stack);
  }
};

const kafkaRunConsumer = async (topics, groupId, handler, kafka = kafkaInstance) => {
  try {
    const kafkaConsumer = kafka.consumer({ groupId, sessionTimeout: 60000 * 10 }); // max 10 minutes process
    await kafkaConsumer.connect();
    await kafkaConsumer.subscribe({ topics, fromBeginning: true });
    await kafkaConsumer.run({
      eachMessage: async ({ topic, partition, message, heartbeat }) => {
        const scope = `${topic} [${partition} | ${message.offset}] / ${message.timestamp}`;
        logger.log(ctx, 'consuming kafka message', scope);
        const body = JSON.parse(message.value);

        await handler(topic, body);
        await heartbeat();
      },
    });

    // add consumer group to consumers pooling
    kafkaConsumers.push(kafkaConsumer);
  } catch (error) {
    logger.error(ctx, error?.message, 'kafkaRunConsumer', error?.stack);
  }
};

const disconnect = async () => {
  if (kafkaProducer) {
    await kafkaProducer.disconnect();
  }
  if (kafkaConsumers.length) {
    for (let index = 0; index < kafkaConsumers.length; index++) {
      await kafkaConsumers[index].disconnect();
    }
  }
};

module.exports = {
  init,
  disconnect,
  kafkaRunConsumer,
  kafkaSendProducer,
  createTopics
};
