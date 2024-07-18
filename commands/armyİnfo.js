const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

// Dosya yolunu güncelleyin
const filePath = './data/civilizations.json';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ordu_bilgisi')
        .setDescription('Medeniyetindeki piyade ve süvari bilgilerini gösterir'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const civilizations = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        const civilizationName = 'Roma'; 
        const civilization = civilizations[civilizationName];

        if (!civilization) {
            return interaction.reply({ content: 'Medeniyet bilgileri bulunamadı!', ephemeral: true });
        }

        const infantry = civilization.troops.infantry || {};
        const cavalry = civilization.troops.cavalry || {};

        const embed = new EmbedBuilder()
            .setTitle('Ordu Bilgisi')
            .addFields(
                { name: 'Piyade', value: `Miktar: ${infantry.amount || 0}\nSeviye: ${infantry.level || 0}\nSaldırı: ${infantry.attack || 0}\nSavunma: ${infantry.defense || 0}`, inline: true },
                { name: 'Süvari', value: `Miktar: ${cavalry.amount || 0}\nSeviye: ${cavalry.level || 0}\nSaldırı: ${cavalry.attack || 0}\nSavunma: ${cavalry.defense || 0}`, inline: true }
            )
            .setColor('#FFA500');

        await interaction.reply({ embeds: [embed] });
    },
};
