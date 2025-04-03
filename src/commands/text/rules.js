import fs from 'fs/promises';

export default async function rules(message) {
    try {
        const rulesData = await fs.readFile('./src/config/rules.json', 'utf8');
        const rules = JSON.parse(rulesData);

        let rulesMessage = '';

        for (const key in rules) {
            const field = rules[key];
            if (field.title) {
                rulesMessage += `${field.title}\n\n`;
            }
            if (field.content) {
                rulesMessage += field.content.join('\n') + '\n\n';
            }
        }

        await message.channel.send(rulesMessage.trim());
        await message.delete();
    } catch (error) {
        console.error('Error sending rules message:', error);
    }
}