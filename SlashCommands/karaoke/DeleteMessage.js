const client = require('../../index');
const db = require('../../Models/KaraokeSchema');

client.on('messageDelete', async (message) => {
  if (message.author.id === client.user.id) {
    const data = await db.findOne({ messid: message.id });
    if (!data) return;
    if (data) {
      data.deleteOne();
    }
  }
});
