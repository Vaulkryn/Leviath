import { Events } from 'discord.js';
import addRSS from './slash/addRSS.js';
import clearMsg from './slash/clearMsg.js';

export default function slashCommandHandler(client) {
    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isCommand()) return;
        const { commandName } = interaction;
        if (commandName === 'add-rss') {
            await addRSS(interaction);
        }
        if (commandName === 'clear-msg') {
            await clearMsg(interaction);
        }
    });
}