const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kaynak_harcam')
        .setDescription('Kaynak harcamak için kullanılır')
        .addStringOption(option =>
            option.setName('tür')
                .setDescription('Harcanacak kaynak türü')
                .setRequired(true)
                .addChoices(
                    { name: 'Altın', value: 'gold' },
                    { name: 'Gümüş', value: 'silver' },
                    { name: 'Demir', value: 'iron' },
                    { name: 'Elmas', value: 'diamond' },// discord.gg/codeblog
                    { name: 'Odun', value: 'wood' },
                    { name: 'Taş', value: 'stone' }
                ))
        .addIntegerOption(option =>
            option.setName('miktar')
                .setDescription('Harcanacak miktar')
                .setRequired(true)),
    async execute(interaction) {
        const type = interaction.options.getString('tür');
        const amount = interaction.options.getInteger('miktar');
        const userId = interaction.user.id;
        const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));

        if (!users[userId]) {
            return interaction.reply({ content: 'Önce bir medeniyet oluşturmalısın!', ephemeral: true });
        }

        if (users[userId].resources[type] < amount) {
            return interaction.reply({ content: 'Yeterli kaynağın yok!', ephemeral: true });
        }

        users[userId].resources[type] -= amount;
        fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2));

        const embed = new EmbedBuilder()
            .setTitle('Kaynak Harcandı')
            .setDescription(`${amount} ${type} harcadın!`)
            .setColor('#FF0000');

        await interaction.reply({ embeds: [embed] });
    },
};