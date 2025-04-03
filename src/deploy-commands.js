import { REST, Routes } from 'discord.js';
import { getToken, getClientId, getAllGuildIds, getServerConfigByGuildId } from './utils/serverDataHandler.js';

const TOKEN = getToken();
const CLIENT_ID = getClientId();
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        const guildIds = getAllGuildIds();
        for (const guildId of guildIds) {
            const serverConfig = getServerConfigByGuildId(guildId);
            if (!serverConfig) {
                console.error(`Unable to find configuration for guildId: ${guildId}`);
                continue;
            }

            const { guild_id: GUILD_ID, serverName, commands } = serverConfig;

            console.log(`Deploying commands to server: ${serverName}.`);
            for (const command of commands) {
                console.log(`/${command.name} ✔️`);
            }

            await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
                body: commands
            });

            console.log(`Commands successfully deployed. ✅\n`);
        }
    } catch (error) {
        console.error('Error deploying commands: ❌\n', error);
    }
})();
