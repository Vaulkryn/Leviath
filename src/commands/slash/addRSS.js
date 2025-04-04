import { MessageFlags } from 'discord.js';
import { saveRSSFeed } from '../../utils/saveRSSfeed.js';

export default async function addRSS(interaction) {
    try {
        if (!interaction.isCommand()) return;

        const url = interaction.options.getString('url');
        const channel = interaction.options.getChannel('channel');

        if (!url || !channel) {
            return interaction.reply({
                content: 'Vous devez fournir une URL valide et un salon.',
                flags: MessageFlags.Ephemeral,
            });
        }

        if (!isValidURL(url)) {
            return interaction.reply({
                content: 'L\'URL fournie n\'est pas valide.',
                flags: MessageFlags.Ephemeral,
            });
        }

        const response = await fetch(url);
        if (!response.ok) {
            return interaction.reply({
                content: 'Impossible de récupérer le flux RSS. Vérifiez l\'URL.',
                flags: MessageFlags.Ephemeral,
            });
        }

        const rssData = await response.text();
        if (!rssData.includes('<rss')) {
            return interaction.reply({
                content: 'L\'URL fournie ne semble pas être un flux RSS valide.',
                flags: MessageFlags.Ephemeral,
            });
        }

        saveRSSFeed(url, channel.id);
        return interaction.reply({
            content: `Flux RSS ajouté ✅.`,
            flags: MessageFlags.Ephemeral,
        });
    } catch (error) {
        console.error('Erreur lors de l\'ajout du flux RSS:', error);
        return interaction.reply({
            content: 'Une erreur est survenue lors de l\'ajout du flux RSS.',
            flags: MessageFlags.Ephemeral,
        });
    }
}

function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}