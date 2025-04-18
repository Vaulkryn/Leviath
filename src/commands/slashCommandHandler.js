import { Events, MessageFlags } from 'discord.js';
import clearMsg from './slash/clearMsg.js';
import gameNewsHandler from './slash/gameNewsHandler.js';
import fetchSteamGames from '../utils/game-news-system/fetchSteamGames.js';
import generateGameURL from '../utils/game-news-system/generateGameURL.js';

export default function slashCommandHandler(client) {
    client.on(Events.InteractionCreate, async (interaction) => {

        if (interaction.isAutocomplete()) {
            const { commandName, options } = interaction;
            if (commandName === 'game-news') {
                const query = options.getString('name');
                const games = await fetchSteamGames(query);

                await interaction.respond(
                    games.map(game => ({
                        name: game.name,
                        value: game.value
                    }))
                );
            }
            return;
        }

        if (interaction.isCommand()) {
            const { commandName, options } = interaction;
            if (commandName === 'game-news') {
                const subCommand = options.getSubcommand();
                if (subCommand === 'add') {
                    const gameName = options.getString('name');
                    if (gameName == '...') {
                        await interaction.reply({ 
                            content: `> Mdr putain t'es con 😵`, 
                            flags: MessageFlags.Ephemeral 
                        });
                        return;
                    }
                    const gameURL = await generateGameURL(gameName);
                    if (!gameURL) {
                        await interaction.reply({ 
                            content: `> ⚠️ **${gameName}** n'existe pas dans la base de données Steam.`, 
                            flags: MessageFlags.Ephemeral 
                        });
                        return;
                    }

                    await gameNewsHandler(interaction, 'add', gameURL, gameName);

                } else if (subCommand === 'remove') {
                    const gameName = options.getString('name');
                    if (!gameName) {
                        await interaction.reply({ 
                            content: `> Veuillez spécifier un jeu.`, 
                            flags: MessageFlags.Ephemeral 
                        });
                        return;
                    }
                    
                    await gameNewsHandler(interaction, 'remove', gameName);
                }
            }
            if (commandName === 'clear-msg') {
                await clearMsg(interaction);
            }
        }
    });
}