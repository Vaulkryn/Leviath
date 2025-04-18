import { MessageFlags } from 'discord.js';
import createNewChannel from '../../utils/game-news-system/createNewChannel.js';
import manageRSSfeed from '../../utils/game-news-system/manageRSSfeed.js';
import displayGameNews from '../../utils/game-news-system/displayGameNews.js';

export default async function gameNewsHandler(interaction, action, gameURL, gameName) {
    try {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        if (action === 'add') {
            const newChannel = await createNewChannel(interaction);
            if (!newChannel) {
                console.error('The RSS feed already exists.');

                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({
                        content: 'Le flux RSS existe déjà.',
                        flags: MessageFlags.Ephemeral,
                    });
                } else {
                    await interaction.editReply({
                        content: 'Le flux RSS existe déjà.',
                    });
                }
                return;
            }

            const channelId = newChannel.id;
            const newsData = await manageRSSfeed(gameURL, channelId);
            //const translatedNewsData = await newsTranslator(newsData);

            await displayGameNews(newsData, channelId, interaction.client);

            await interaction.editReply({
                content: `> Updates Steam ajoutées pour **${gameName}**.
                > ⚠️ N'oublie pas d'ajouter le rôle dans "Processus d'accueil->Questions->Questions complémentaires.`,
                flags: MessageFlags.Ephemeral,
            });
        } else if (action === 'remove') {
            //await manageDeletion(interaction);
        }
    } catch (error) {
        console.error('Erreur dans gameNewsHandler:\n', error);

        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: 'Une erreur est survenue lors du traitement de la commande.',
                flags: MessageFlags.Ephemeral,
            });
        } else {
            await interaction.editReply({
                content: 'Une erreur est survenue lors du traitement de la commande.',
            });
        }
    }
}