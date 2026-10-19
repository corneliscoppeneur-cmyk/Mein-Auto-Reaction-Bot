import { api } from 'sdk';
import { BOT_USERNAME } from '../lib/config.js';
import { react, REACTIONS } from '../lib/react.js';

const START_TEXT = `👋 Hallo NAME!

Ich bin ein Auto-Reaktions-Bot 🎉

✨ *Privat*: Schreib mir und bekomme eine Emoji-Reaktion.
🏖 *Gruppe & Kanal*: Füge mich hinzu, dann reagiere ich automatisch auf Beiträge. In Kanälen brauche ich Adminrechte.

✍️ Welche Emojis ich nutze: /reactions`;

export default async function (message) {
  const chatId = message.chat.id;
  const text = message.text?.trim() || '';
  const command = text.split(/\s+/)[0].toLowerCase();

  if (command === '/start' || command === `/start@${BOT_USERNAME.toLowerCase()}`) {
    const name = message.chat.type === 'private' ? message.from?.first_name : message.chat.title;
    await api.sendMessage({
      chat_id: chatId,
      text: START_TEXT.replace('NAME', name || ''),
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[
          { text: '➕ Zu Kanal hinzufügen', url: `https://t.me/${BOT_USERNAME}?startchannel=botstart` },
          { text: '➕ Zu Gruppe hinzufügen', url: `https://t.me/${BOT_USERNAME}?startgroup=botstart` },
        ]],
      },
    });
    return;
  }

  if (command === '/reactions' || command === `/reactions@${BOT_USERNAME.toLowerCase()}`) {
    await api.sendMessage({ chat_id: chatId, text: '✅ Aktive Reaktionen:\n\n' + REACTIONS.join(', ') });
    return;
  }

  await react(message);
}
