const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('asker_al')
        .setDescription('Yeni piyade veya süvari alır')
        .addStringOption(option =>
            option.setName('tür')
                .setDescription('Almak istediğin asker türü')
                .setRequired(true)
                .addChoices(
                    { name: 'Piyade', value: 'infantry' },
                    { name: 'Süvari', value: 'cavalry' }// discord.gg/codeblog
                ))
        .addIntegerOption(option =>
            option.setName('miktar')
                .setDescription('Almak istediğin miktar')
                .setRequired(true)),
    async execute(interaction) {
        const type = interaction.options.getString('tür');
        const amount = interaction.options.getInteger('miktar');
        const userId = interaction.user.id;
        const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));

        if (!users[userId]) {
            users[userId] = {
                "buildingsLevel": 0,
                "technologiesLevel": 0,
                "troops": {
                    "infantry": {
                        "amount": 0,
                        "level": 1,
                        "attack": 10,
                        "defense": 10
                    },
                    "cavalry": {
                        "amount": 0,
                        "level": 1,
                        "attack": 20,
                        "defense": 15
                    }
                },
                "resources": {
                    "wood": 29,
                    "stone": 75,
                    "gold": 72,
                    "silver": 44,
                    "iron": 68,
                    "diamond": 76
                }
            };
        }

        const user = users[userId];
        const costPerUnit = {
            infantry: 10,
            cavalry: 20
        };

        const totalCost = costPerUnit[type] * amount;

        if (user.resources.gold < totalCost) {
            return interaction.reply({ content: 'Yeterli altının yok!', ephemeral: true });
        }

        user.resources.gold -= totalCost;
        user.troops[type].amount += amount;

        fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2));

        const embed = new EmbedBuilder()
            .setTitle('Asker Alındı')
            .setDescription(`${amount} ${type} başarıyla alındı!`)
            .setColor('#00FF00');

        await interaction.reply({ embeds: [embed] });
    },
};
