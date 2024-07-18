const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kaynak_bilgisi')
        .setDescription('Kaynak bilgilerini gösterir'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));

        if (!users[userId]) {
            return interaction.reply({ content: 'Önce bir medeniyet oluşturmalısın!', ephemeral: true });
        }

        const resources = users[userId].resources || {
            gold: 0,
            silver: 0,
            iron: 0,
            diamond: 0,
            wood: 0,
            stone: 0
        };

        const gold = resources.gold ?? 0;
        const silver = resources.silver ?? 0;
        const iron = resources.iron ?? 0;
        const diamond = resources.diamond ?? 0;
        const wood = resources.wood ?? 0;
        const stone = resources.stone ?? 0;

        const embed = new EmbedBuilder()
            .setTitle('Kaynak Bilgileri')
            .addFields(
                { name: 'Altın', value: gold.toString(), inline: true },
                { name: 'Gümüş', value: silver.toString(), inline: true },
                { name: 'Demir', value: iron.toString(), inline: true },
                { name: 'Elmas', value: diamond.toString(), inline: true },
                { name: 'Odun', value: wood.toString(), inline: true },
                { name: 'Taş', value: stone.toString(), inline: true }
            )
            .setColor('#FFA500');

        await interaction.reply({ embeds: [embed] });
    },
};
