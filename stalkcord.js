const Discord = require('discord.js');
const moment = require('moment');
const db = require('quick.db');

const client = new Discord.Client();


const botToken = 'Sihirli BOT Tokeni';

client.on('ready', () => {
  console.log(`・${client.user.tag} olarak giriş yaptım ve Stalk görevime hazırım.`);
});

client.on('message', message => {
  if (message.content === '!aktivite') {
    const userId = 'Sanal Manitanızın Discord IDsi :D';

    client.users.fetch(userId).then(user => {
      const lastMessage = user.lastMessage;
      const lastActivity = lastMessage ? lastMessage.createdAt : user.createdAt;
      const lastOnline = user.presence.lastOnline || null;
      const isOnline = user.presence.status === 'online';
      const profilePhotos = user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 });
      const lastActivityAgo = moment(lastActivity).fromNow();
      const activityDetails = [];

      
      user.presence.activities.forEach(activity => {
        if (activity.type === 'CUSTOM_STATUS') {
          activityDetails.push(`Özel Durum: ${activity.state}`);
        } else if (activity.type === 'PLAYING') {
          activityDetails.push(`Oynuyor: ${activity.name}`);
        } else if (activity.type === 'LISTENING') {
          activityDetails.push(`Dinliyor: ${activity.name}`);
        } else if (activity.type === 'WATCHING') {
          activityDetails.push(`İzliyor: ${activity.name}`);
        } else if (activity.type === 'STREAMING') {
          activityDetails.push(`Yayında: ${activity.name}`);
        }
      });

      
      const previousPhoto = db.get(`photo_${userId}`);
      if (profilePhotos !== previousPhoto) {
       
        db.set(`photo_${userId}`, previousPhoto || '');
      }

   
      db.set(`activity_${userId}`, {
        lastActivity: lastActivity ? moment(lastActivity).format('YYYY-MM-DD HH:mm:ss') : null,
        lastOnline: lastOnline ? moment(lastOnline).format('YYYY-MM-DD HH:mm:ss') : null,
        isOnline: isOnline,
        activityDetails: activityDetails
      });

     
      const embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`${user.username}'ın Son Aktivitesi`)
        .setDescription(`Son Aktivite: ${lastActivityAgo}`)
        .addField('Son Görülme', lastOnline ? moment(lastOnline).format('YYYY-MM-DD HH:mm:ss') : 'Bilinmiyor')
        .addField('Önceki Aktiviteler', activityDetails.join('\n'))
        .setImage(profilePhotos);

      if (previousPhoto) {
       
        embed.addField('Önceki Profil Fotoğrafı', previousPhoto);
      }

      message.channel.send(embed);
    }).catch(err => {
      message.channel.send('Kullanıcı bulunamadı.');
    });
  }
});


client.login(botToken);
