import { Kafka } from "kafkajs";
import { log } from "node:console";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
export const startSendMailConsumer = async () => {
  try {
    const kafka = new Kafka({
      clientId: "mail-service",
      brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
    });

    const consumer = kafka.consumer({ groupId: "mail-group" });
    await consumer.connect();

    const topicName = "send-mail";

    await consumer.subscribe({ topic: topicName, fromBeginning: false });

    // console.log("Kafka service consumer,listning for sending mail");

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          // console.log(
          //   `Topic is =[${topic}] Partition is =:[${partition}]:}`,message.value?.toString(),
          // );

          const { to, subject, html } = JSON.parse(
            message.value?.toString() || "{}",
          );

          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com", // Replace with your SMTP host.email',
            port: 465,
            secure: true,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASSWORD,
            },
          });

          await transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject,
            html,
          });
          log(`Email sent to ${to} with subject: ${subject}`);
        } catch (error: any) {
          console.error("Error processing message:", error);
        }
      },
    });
  } catch (error: any) {
    log("Error in mail consumer:", error.message);
  }
};
