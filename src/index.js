import { Client, GatewayIntentBits, Events } from 'discord.js';
import { getToken } from './utils/serverDataHandler.js';
import slashCommandHandler from './commands/slashCommandHandler.js';
import textCommandHandler from './commands/textCommandHandler.js';
import eventHandler from './events/eventHandler.js';
import globalEventHandler from './events/globalEventHandler.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ]
});

client.once(Events.ClientReady, () => {
    console.log('Leviath is ready.\n');
});

slashCommandHandler(client);
textCommandHandler(client);
eventHandler(client);
globalEventHandler(client)

const TOKEN = getToken();
client.login(TOKEN);