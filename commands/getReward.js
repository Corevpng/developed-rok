const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('odul_al')
        .setDescription('Medeniyet seviyene göre ödül alırsın!'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));
        const civilizations = JSON.parse(fs.readFileSync('./data/civilizations.json', 'utf8'));

        if (!users[userId]) {
            return interaction.reply({ content: 'Önce bir medeniyet oluşturmalısın!', ephemeral: true });// discord.gg/codeblog
        }

        const user = users[userId];
        const civilization = Object.keys(civilizations).find(civ => user.civilization === civ);

        if (!civilization) {
            return interaction.reply({ content: 'Geçerli bir medeniyetin yok!', ephemeral: true });
        }

        const level = civilizations[civilization].level;
        let reward = 0;

        if (level >= 10 && level < 20) {
            reward = 100; 
        } else if (level >= 20 && level < 30) {
            reward = 200; 
        } else if (level >= 30) {
            reward = 300;
        }

        if (reward > 0) {
            users[userId].resources.gold += reward;
            fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2));

            const embed = new EmbedBuilder()
                .setTitle('Ödül Kazandın!')
                .setDescription(`Tebrikler! Medeniyet seviyene göre ${reward} altın kazandın!`)
                .setColor('#00FF00');

            await interaction.reply({ embeds: [embed] });
        } else {
            await interaction.reply({ content: 'Ödül almak için yeterli seviyede değilsin.', ephemeral: true });
        }
    },
};
