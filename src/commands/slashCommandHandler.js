import { Events } from 'discord.js';
import addRSS from './slash/addRSS.js';

export default function slashCommandHandler(client) {
    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isCommand()) return;
        const { commandName } = interaction;
        if (commandName === 'addRSS') {
            await addRSS(interaction);
        }
    });
}