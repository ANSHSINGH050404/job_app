import {Kafka, Producer,Admin} from 'kafkajs'
import dotenv from 'dotenv'
import { log } from 'node:console'

dotenv.config()


let producer: Producer
let admin: Admin


export const connectKafka = async () => {
    try {
        const kafka = new Kafka({
            clientId: 'auth-service',
            brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
        });

   

        admin = kafka.admin();
        await admin.connect();


        const topics=await admin.listTopics();

            if (!topics.includes('send-mail')) {

                await admin.createTopics({
                    topics: [
                        {
                             topic: 'send-mail',
                             numPartitions: 1,
                             replicationFactor: 1,
                            
                        }
                    ],
                });

                console.log("✅ Topic send-mail created");
                
            }


            await admin.disconnect();


            producer = kafka.producer();
            await producer.connect();


            log("✅ Kafka producer connected successfully");






    } catch (error) {
        console.error("Error connecting to Kafka:", error);
    }
}


export const publishToTopic = async (topic: string, messages: { key: string; value: string }[]) => {
    try {
        if (!producer) {
            throw new Error("Kafka producer is not connected");
        }

        await producer.send({
            topic,
            messages:[
                {
                    value: JSON.stringify(messages)
                }
            ]
        });
    } catch (error) {
        console.error("Error publishing message to Kafka topic:", error);
    }
};



export const disconnectKafka = async () => {
    try {
        if (producer) {
            await producer.disconnect();
        }
    } catch (error) {
        console.error("Error disconnecting from Kafka:", error);
    }
};
