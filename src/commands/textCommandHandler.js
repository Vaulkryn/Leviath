import { Events } from 'discord.js';
import rules from './text/rules.js';

export default function textCommandHandler(client) {
    client.on(Events.MessageCreate, async (message) => {
        if (message.author.bot) return;

        if (message.content.startsWith('|rules')) {
            await rules(message);
        }
    });
}