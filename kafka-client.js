import {Kafka} from 'kafkajs'


export const kafkaClient = new Kafka({
    clientID: 'chaicode',
    brokers: ['localhost:9092'],// can be many broker but we have one at this point of time.
});
