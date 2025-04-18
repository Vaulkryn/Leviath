import { ChannelType, MessageFlags } from 'discord.js';

/**
 * Convertit une couleur HSL en hexadécimal.
 * @param {number} h - Teinte (0-360).
 * @param {number} s - Saturation (0-100).
 * @param {number} l - Luminosité (0-100).
 * @returns {string} - Couleur en hexadécimal (ex. "#RRGGBB").
 */

function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
        Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));

    return `#${f(0).toString(16).padStart(2, '0')}${f(8).toString(16).padStart(2, '0')}${f(4).toString(16).padStart(2, '0')}`;
}

/**
 * Génère une couleur aléatoire en hexadécimal avec un écart suffisant par rapport à la couleur du rôle précédent.
 * @param {string} previousColor - La couleur précédente en hexadécimal (ex. "#FF0000").
 * @returns {string} - Une nouvelle couleur en hexadécimal.
 */

function generateContrastingColor(previousColor) {
    const getRandomHue = () => Math.floor(Math.random() * 360); // Teinte aléatoire (0-360)
    const hueDifferenceThreshold = 120; // Écart minimum en degrés (120° pour un contraste élevé)

    let previousHue = 0;
    if (previousColor) {
        // Convertir la couleur précédente en HSL pour extraire la teinte
        const rgb = parseInt(previousColor.slice(1), 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = rgb & 0xff;

        const max = Math.max(r, g, b) / 255;
        const min = Math.min(r, g, b) / 255;
        const delta = max - min;

        if (delta === 0) previousHue = 0;
        else if (max === r) previousHue = ((g - b) / delta) % 6;
        else if (max === g) previousHue = (b - r) / delta + 2;
        else previousHue = (r - g) / delta + 4;

        previousHue = Math.round(previousHue * 60);
        if (previousHue < 0) previousHue += 360;
    }

    let newHue;
    do {
        newHue = getRandomHue();
    } while (Math.abs(newHue - previousHue) < hueDifferenceThreshold);

    // Convertir la teinte en une couleur hexadécimale (avec saturation et luminosité fixes)
    const saturation = 75; // Saturation fixe (75%)
    const lightness = 50; // Luminosité fixe (50%)
    return hslToHex(newHue, saturation, lightness);
}

export default async function createNewChannel(interaction) {
    try {
        const categoryId = '1355282218372825209';
        const gameName = interaction.options.getString('name');
        const normalizedGameName = gameName.toLowerCase().replace(/ /g, '-').replace(/:/g, '');
        const formattedName = `❕丨${normalizedGameName}`;
        console.log(`Adding game news ${gameName}...`);

        const category = interaction.guild.channels.cache.get(categoryId);
        if (!category || category.type !== ChannelType.GuildCategory) {
            await interaction.reply({
                content: `> La catégorie spécifiée est introuvable ou invalide.`,
                flags: MessageFlags.Ephemeral
            });
            return null;
        }

        const roles = interaction.guild.roles.cache.sort((a, b) => b.createdTimestamp - a.createdTimestamp);
        const existingRole = roles.find(role => role.name.toLowerCase() === gameName.toLowerCase());
        if (existingRole) {
            await interaction.reply({
                content: `> ⚠️ Les news pour **${gameName}** ont déjà été ajoutées.`,
                flags: MessageFlags.Ephemeral
            });
            return null;
        }

        const lastRole = roles.first();
        const lastRoleColor = lastRole?.color ? `#${lastRole.color.toString(16).padStart(6, '0')}` : null;
        const newRoleColor = generateContrastingColor(lastRoleColor);
        const role = await interaction.guild.roles.create({
            name: gameName,
            mentionable: true,
            color: newRoleColor,
            reason: `Rôle créé pour le salon ${gameName}`,
        });

        const newChannel = await interaction.guild.channels.create({
            name: formattedName,
            type: ChannelType.GuildText,
            parent: categoryId,
            topic: `Steam updates`,
        });

        await newChannel.permissionOverwrites.create(role, {
            ViewChannel: true,
            ReadMessageHistory: true,
        });

        const roleToRemoveId = '1356126908160413869';
        await newChannel.permissionOverwrites.delete(roleToRemoveId); 
        console.log('Channel and role created.');
        return newChannel;

    } catch (error) {
        console.error('Error:', error);
        await interaction.reply({ content: `> Une erreur est survenue lors de la création du salon ou du rôle.`, flags: MessageFlags.Ephemeral });
        return null;
    }
}