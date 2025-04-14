import createNewChannel from '../../utils/game-news-system/createNewChannel.js';

export default async function gameNewsHandler(interaction, action, gameURL) {
    if (action === 'add') {
        //await createNewChannel(interaction);
        //await manageRSSfeed(interaction, gameURL); // save in the json file & fetch the XML data
        //await displayGameNews(interaction);
    } else if (action === 'remove') {
        //await manageDeletion(interaction);
    } else {
        throw new Error('Action non reconnue: ' + action);
    }
}
