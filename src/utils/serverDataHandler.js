import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const commands = JSON.parse(fs.readFileSync('./src/config/commands.json', 'utf8'));

export function getToken() {
    return process.env.TOKEN;
}

export function getClientId() {
    return process.env.CLIENT_ID;
}

export function getAllGuildIds() {
    return Object.keys(process.env)
        .filter(key => key.endsWith('_GUILD_ID'))
        .map(key => process.env[key]);
}

export function getServerConfigByGuildId(guildId) {
    const prefix = Object.keys(process.env).find(key => process.env[key] === guildId)?.replace('_GUILD_ID', '');
    if (prefix) {
        return {
            serverName: prefix.replace('_', ' '),
            guild_id: process.env[`${prefix}_GUILD_ID`],
            dynamic_voice_channel: process.env[`${prefix}_DYNAMIC_VOICE_CHANNELS`]?.split(',') || [],
            commands: commands[prefix] || []
        };
    }
    return null;
}