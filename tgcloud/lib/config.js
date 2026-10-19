// Bot settings. The Bot API token is not needed here: Telegram Serverless provides the API.
export const BOT_USERNAME = 'meinReactionbot';

// Reactions to pick from. Chats that allow fewer reactions are handled automatically.
export const EMOJI_LIST = '👍❤🔥🥰👏😁🎉🤩🙏';

// 0 = react to every group message, 10 = react to almost none (groups only).
export const RANDOM_LEVEL = 0;

// Chat IDs the bot must never react in.
export const RESTRICTED_CHATS = [];
