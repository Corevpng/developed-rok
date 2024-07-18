const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tüccar')
        .setDescription('Tüccardaki ürünleri ve kaynakları gösterir veya satın almanızı sağlar')
        .addStringOption(option =>
            option.setName('işlem')
                .setDescription('Görüntülemek veya satın almak istediğiniz işlem')
                .setRequired(true)
                .addChoices(
                    { name: 'Görüntüle', value: 'view' },
                    { name: 'Satın Al', value: 'buy' }
                ))
        .addStringOption(option =>
            option.setName('ürün')// discord.gg/codeblog
                .setDescription('Satın almak istediğiniz ürünün adını girin')
                .setRequired(false)),
    async execute(interaction) {
        const action = interaction.options.getString('işlem');
        const productName = interaction.options.getString('ürün');
        const userId = interaction.user.id;
        const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));

        // Tüccarın ürün ve kaynak listesi
        const traderInventory = {
            "health_potion": { name: 'Sağlık İksiri', price: 10 },
            "mana_potion": { name: 'Mana İksiri', price: 15 },
            "sword": { name: 'Kılıç', price: 50 },
            "shield": { name: 'Kalkan', price: 40 },
            "gold": { name: 'Altın', price: 20, type: 'resource' },
            "silver": { name: 'Gümüş', price: 15, type: 'resource' },
            "iron": { name: 'Demir', price: 25, type: 'resource' },
            "diamond": { name: 'Elmas', price: 30, type: 'resource' },
            "wood": { name: 'Odun', price: 10, type: 'resource' },
            "stone": { name: 'Taş', price: 12, type: 'resource' }
        };

        if (action === 'view') {
            const embed = new EmbedBuilder()
                .setTitle('Tüccar Kataloğu')
                .setDescription('Tüccardaki mevcut ürünler:')
                .setColor('#00FF00');

            for (const [key, value] of Object.entries(traderInventory)) {
                embed.addFields(
                    { name: value.name, value: `${value.price} crystals`, inline: true }
                );
            }

            await interaction.reply({ embeds: [embed] });

        } else if (action === 'buy') {
            if (!productName || !traderInventory[productName]) {
                return interaction.reply({ content: 'Geçerli bir ürün seçmelisiniz!', ephemeral: true });
            }

            if (!users[userId]) {
                return interaction.reply({ content: 'Önce bir medeniyet oluşturmalısın!', ephemeral: true });
            }

            const user = users[userId];
            const product = traderInventory[productName];

            if (user.resources.crystals < product.price) {
                return interaction.reply({ content: 'Yeterli kristalin yok!', ephemeral: true });
            }

            user.resources.crystals -= product.price;

            if (product.type === 'resource') {
                if (!user.resources[productName]) {
                    user.resources[productName] = 0;
                }
                user.resources[productName] += 1;
            } else {
                if (!user.inventory) {
                    user.inventory = {};
                }

                if (!user.inventory[productName]) {
                    user.inventory[productName] = 0;
                }
                user.inventory[productName] += 1;
            }

            fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2));

            const embed = new EmbedBuilder()
                .setTitle('Satın Alma Başarılı')
                .setDescription(`Başarıyla ${product.name} aldınız!`)
                .setColor('#00FF00');

            await interaction.reply({ embeds: [embed] });
        }
    },
};
