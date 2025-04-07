const TelegramBot = require('node-telegram-bot-api');

const TOKEN = '7676057131:AAELLtx8nzc4F1_PbMGxE-7R3sCvM1lufdM'; // 🔐 Use direto
const API_KEY = 'PRe'; // Autorização simples

const contratosToChatId = {
  "117/2023 - Esporte Maricá": "-4765938730",
  "267/2023 - Predial Maricá": "-1002652489871",
  "222/2023 - Escolas Maricá": "-4628790026",
  "10/2021 - Eletricá Predial": "-4653709864"
};

const bot = new TelegramBot(TOKEN, { polling: false });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  if (req.headers['authorization'] !== API_KEY) {
    return res.status(403).json({ error: 'Acesso não autorizado' });
  }

  const { contrato, encarregado, obra, solicitante, materiais } = req.body;

  const contratoLimpo = contrato?.trim();
  const chatId = contratosToChatId[contratoLimpo];

  if (!chatId) {
    return res.status(400).json({ error: 'Contrato não encontrado ou sem grupo associado' });
  }

  const mensagem = `🏗️ *NOVO PEDIDO - PERFIL-X* \n\n` +
    `📄 *Contrato:* ${contrato}\n` +
    `👷 *Encarregado:* ${encarregado}\n` +
    `🏭 *Obra:* ${obra}\n` +
    `📋 *Solicitante:* ${solicitante}\n\n` +
    `📦 *Materiais:*\n${materiais.map(item =>
      `▸ ${item.nome}: ${item.quantidade} ${item.unidade || 'un'}`
    ).join('\n')}`;

  try {
    await bot.sendMessage(chatId, mensagem, { parse_mode: 'Markdown' });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error.message);
    res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
}
