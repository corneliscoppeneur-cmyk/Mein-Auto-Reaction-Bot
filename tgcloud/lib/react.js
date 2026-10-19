import { api, BotApiError } from 'sdk';
import { EMOJI_LIST, RANDOM_LEVEL, RESTRICTED_CHATS } from './config.js';

const EMOJI_REGEX = /(\p{Emoji_Presentation}|\p{Extended_Pictographic}|\p{Emoji_Modifier_Base})/gu;
export const REACTIONS = EMOJI_LIST.match(EMOJI_REGEX) || [];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function setReaction(chatId, messageId, emoji) {
  return api.setMessageReaction({
    chat_id: chatId,
    message_id: messageId,
    reaction: [{ type: 'emoji', emoji }],
  });
}

// Emojis from our list that the chat allows. No `available_reactions` means all are allowed.
async function allowedReactions(chatId) {
  const chat = await api.getChat({ chat_id: chatId });
  if (!chat.available_reactions) return REACTIONS;
  const allowed = new Set(chat.available_reactions.filter((r) => r.type === 'emoji').map((r) => r.emoji));
  return REACTIONS.filter((emoji) => allowed.has(emoji));
}

// React to a message or channel post with a random emoji from the list.
export async function react(content) {
  const chatId = content.chat.id;
  if (REACTIONS.length === 0 || RESTRICTED_CHATS.includes(chatId)) return;

  // Groups react only to a share of messages, depending on RANDOM_LEVEL.
  const isGroup = ['group', 'supergroup'].includes(content.chat.type);
  if (isGroup && Math.random() > 1 - RANDOM_LEVEL / 10) return;

  try {
    await setReaction(chatId, content.message_id, pick(REACTIONS));
  } catch (e) {
    if (!(e instanceof BotApiError) || !e.description?.includes('REACTION_INVALID')) throw e;
    // The chat limits its reactions: retry once with an emoji it allows.
    const allowed = await allowedReactions(chatId);
    if (allowed.length === 0) return;
    await setReaction(chatId, content.message_id, pick(allowed));
  }
}
