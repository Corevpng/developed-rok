const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('medeniyet_bilgisi')
        .setDescription('Medeniyetin bilgilerini gösterir'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));

        if (!users[userId]) {
            return interaction.reply({ content: 'Önce bir medeniyet oluşturmalısın!', ephemeral: true });
        }

        const user = users[userId];

        const infantry = user.troops?.infantry || 0;// discord.gg/codeblog
        const cavalry = user.troops?.cavalry || 0;
        const infantryLevel = user.troops?.infantryLevel || 0;
        const cavalryLevel = user.troops?.cavalryLevel || 0;
        const infantryAttack = user.troops?.infantryAttack || 0;
        const cavalryAttack = user.troops?.cavalryAttack || 0;
        const infantryDefense = user.troops?.infantryDefense || 0;
        const cavalryDefense = user.troops?.cavalryDefense || 0;

        const embed = new EmbedBuilder()
            .setTitle('Medeniyet Bilgisi')
            .addFields(
                { name: 'Binalar Seviyesi', value: (user.buildingsLevel || 0).toString(), inline: true },
                { name: 'Teknolojiler Seviyesi', value: (user.technologiesLevel || 0).toString(), inline: true },
                { name: 'Piyade', value: `Miktar: ${infantry}\nSeviye: ${infantryLevel}\nSaldırı: ${infantryAttack}\nSavunma: ${infantryDefense}`, inline: true },
                { name: 'Süvari', value: `Miktar: ${cavalry}\nSeviye: ${cavalryLevel}\nSaldırı: ${cavalryAttack}\nSavunma: ${cavalryDefense}`, inline: true },
                { name: 'Odun', value: (user.resources?.wood || 0).toString(), inline: true },
                { name: 'Taş', value: (user.resources?.stone || 0).toString(), inline: true },
                { name: 'Altın', value: (user.resources?.gold || 0).toString(), inline: true },
                { name: 'Gümüş', value: (user.resources?.silver || 0).toString(), inline: true },
                { name: 'Demir', value: (user.resources?.iron || 0).toString(), inline: true },
                { name: 'Kristal', value: (user.resources?.diamond || 0).toString(), inline: true }
            )
            .setColor('#FFA500');

        await interaction.reply({ embeds: [embed] });
    },
};
