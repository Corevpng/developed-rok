const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('asker_geliştir')
        .setDescription('Piyade veya süvarini geliştirir')
        .addStringOption(option =>
            option.setName('tür')
                .setDescription('Geliştirmek istediğin asker türü')
                .setRequired(true)
                .addChoices(// discord.gg/codeblog
                    { name: 'Piyade', value: 'infantry' },
                    { name: 'Süvari', value: 'cavalry' }
                ))
        .addIntegerOption(option =>
            option.setName('miktar')
                .setDescription('Geliştirmek istediğin miktar')
                .setRequired(true)),
    async execute(interaction) {
        const type = interaction.options.getString('tür');
        const amount = interaction.options.getInteger('miktar');
        const userId = interaction.user.id;
        const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));

        if (!users[userId]) {
            return interaction.reply({ content: 'Önce bir medeniyet oluşturmalısın!', ephemeral: true });
        }

        const user = users[userId];

        const upgradeCostPerUnit = {
            infantry: 20, 
            cavalry: 40   
        };

        const totalCost = upgradeCostPerUnit[type] * amount;

        if (user.resources.gold < totalCost) {
            return interaction.reply({ content: 'Yeterli altının yok!', ephemeral: true });
        }

        user.resources.gold -= totalCost;
        user.troops[type].level += amount;
        user.troops[type].attack += amount * 5; 
        user.troops[type].defense += amount * 3; 

        fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2));

        const embed = new EmbedBuilder()
            .setTitle('Asker Geliştirildi')
            .setDescription(`${amount} ${type} başarıyla geliştirildi!`)
            .setColor('#00FF00');

        await interaction.reply({ embeds: [embed] });
    },
};