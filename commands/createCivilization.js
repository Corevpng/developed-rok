const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('medeniyet_oluştur')
        .setDescription('Kendi medeniyetini oluştur')
        .addStringOption(option =>
            option.setName('isim')
                .setDescription('Medeniyet ismi')
                .setRequired(true)),
    async execute(interaction) {
        const name = interaction.options.getString('isim');
        const userId = interaction.user.id;
        const civilizations = JSON.parse(fs.readFileSync('./data/civilizations.json', 'utf8'));
        const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));

        if (users[userId]) {
            return interaction.reply({ content: 'Zaten bir medeniyetin var!', ephemeral: true });
        }// discord.gg/codeblog

        if (!civilizations[name]) {
            return interaction.reply({ content: 'Geçersiz medeniyet ismi!', ephemeral: true });
        }

        users[userId] = civilizations[name];
        fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2));

        const embed = new EmbedBuilder()
            .setTitle('Medeniyet Oluşturuldu')
            .setDescription(`Başarıyla ${name} medeniyetini oluşturdun!`)
            .setColor('#FFD700');

        await interaction.reply({ embeds: [embed] });
    },
};
