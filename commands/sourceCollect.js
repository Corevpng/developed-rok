const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kaynak_topla')
        .setDescription('Kaynak toplamanı sağlar')
        .addStringOption(option =>
            option.setName('tür')
                .setDescription('Toplanacak kaynak türü')
                .setRequired(true)
                .addChoices(
                    { name: 'Altın', value: 'gold' },// discord.gg/codeblog
                    { name: 'Gümüş', value: 'silver' },
                    { name: 'Demir', value: 'iron' },
                    { name: 'Elmas', value: 'diamond' },
                    { name: 'Odun', value: 'wood' },
                    { name: 'Taş', value: 'stone' }
                )),
    async execute(interaction) {
        const type = interaction.options.getString('tür');
        const userId = interaction.user.id;
        const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));

        if (!users[userId]) {
            return interaction.reply({ content: 'Önce bir medeniyet oluşturmalısın!', ephemeral: true });
        }

        if (!users[userId].resources) {
            users[userId].resources = {
                gold: 0,
                silver: 0,
                iron: 0,
                diamond: 0,
                wood: 0,
                stone: 0
            };
        }

        const amount = Math.floor(Math.random() * 100) + 1;
        users[userId].resources[type] += amount;
        fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2));

        const embed = new EmbedBuilder()
            .setTitle('Kaynak Toplandı')
            .setDescription(`${amount} ${type} topladın!`)
            .setColor('#00FF00');

        await interaction.reply({ embeds: [embed] });
    },
};
