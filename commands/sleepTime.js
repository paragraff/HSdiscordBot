module.exports = {
  name: 'bedtime',
  description: 'Set preferable bed time',
  execute(message, args) {
    message.channel.send('Sleep time set');
  }
};