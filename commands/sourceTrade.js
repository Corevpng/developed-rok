const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kaynak_ticaret')
        .setDescription('Başka bir kullanıcı ile kaynak ticareti yapar')
        .addUserOption(option =>
            option.setName('hedef')
                .setDescription('Kaynak göndereceğin kullanıcı')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('tür')
                .setDescription('Gönderilecek kaynak türü')
                .setRequired(true)
                .addChoices(
                    { name: 'Altın', value: 'gold' },
                    { name: 'Gümüş', value: 'silver' },
                    { name: 'Demir', value: 'iron' },// discord.gg/codeblog
                    { name: 'Elmas', value: 'diamond' },
                    { name: 'Odun', value: 'wood' },
                    { name: 'Taş', value: 'stone' }
                ))
        .addIntegerOption(option =>
            option.setName('miktar')
                .setDescription('Gönderilecek miktar')
                .setRequired(true)),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('hedef');
        const type = interaction.options.getString('tür');
        const amount = interaction.options.getInteger('miktar');
        const userId = interaction.user.id;
        const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));

        if (!users[userId]) {
            return interaction.reply({ content: 'Önce bir medeniyet oluşturmalısın!', ephemeral: true });
        }

        if (!users[targetUser.id]) {
            return interaction.reply({ content: 'Hedef kullanıcı medeniyet oluşturmamış!', ephemeral: true });
        }

        if (users[userId].resources[type] < amount) {
            return interaction.reply({ content: 'Yeterli kaynağın yok!', ephemeral: true });
        }

        users[userId].resources[type] -= amount;
        users[targetUser.id].resources[type] += amount;
        fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2));

        const embed = new EmbedBuilder()
            .setTitle('Kaynak Ticaret')
            .setDescription(`${amount} ${type} başarıyla ${targetUser.username} kullanıcısına gönderildi!`)
            .setColor('#00FF00');

        await interaction.reply({ embeds: [embed] });
    },
};
