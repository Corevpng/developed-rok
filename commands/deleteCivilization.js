const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('medeniyet_sil')
        .setDescription('Mevcut medeniyetinizi siler ve verilerinizi temizler.'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));

        if (!users[userId]) {
            return interaction.reply({ content: 'Silinecek bir medeniyetiniz bulunmuyor!', ephemeral: true });
        }

        delete users[userId];
        fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2));

        const embed = new EmbedBuilder()
            .setTitle('Medeniyet Silindi')
            .setDescription('Medeniyetiniz başarıyla silindi ve verileriniz temizlendi.')
            .setColor('#FF0000');

        await interaction.reply({ embeds: [embed] });
    },
};