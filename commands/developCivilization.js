const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

const filePath = './data/civilizations.json';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('medeniyet_geliştir')
        .setDescription('Medeniyetinizi belirli kaynakları kullanarak geliştirin')
        .addStringOption(option =>
            option.setName('kategori')
                .setDescription('Geliştirilmek istenen kategori')
                .setRequired(true)
                .addChoices(
                    { name: 'Binalar', value: 'buildings' },
                    { name: 'Teknolojiler', value: 'technologies' }
                )),
    async execute(interaction) {
        const category = interaction.options.getString('kategori');
        const userId = interaction.user.id;
        const civilizations = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        const civilizationName = 'Roma'; 
        const civilization = civilizations[civilizationName];

        if (!civilization) {
            return interaction.reply({ content: 'Medeniyet bilgileri bulunamadı!', ephemeral: true });
        }

        if (category === 'buildings') {
            civilization.buildingsLevel += 1;
        } else if (category === 'technologies') {
            civilization.technologiesLevel += 1;
        }

        fs.writeFileSync(filePath, JSON.stringify(civilizations, null, 2));

        const embed = new EmbedBuilder()
            .setTitle('Geliştirme Başarıyla Tamamlandı')
            .setDescription(`Medeniyetinizin ${category} seviyesini başarıyla artırdınız!`)
            .setColor('#00FF00');

        await interaction.reply({ embeds: [embed] });
    },
};
