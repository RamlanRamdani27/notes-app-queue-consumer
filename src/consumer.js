require('dotenv').config();
const amqp = require('amqplib');
const NotesService = require('./NotesService');
const MailSender = require('./MailSender');
const Listener = require('./Listener');

const init = async () => {
  const notesServiuce = new NotesService();
  const mailSender = new MailSender();
  const lister = new Listener(notesServiuce, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:notes', {
    durable: true,
  });

  channel.consume('export:notes', lister.listen, { noAck: true });
};

init();
