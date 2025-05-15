export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { contrato, encarregado, obra, solicitante, os, materiais } = req.body;

  if (!contrato || !encarregado || !obra || !solicitante || !materiais || materiais.length === 0) {
    return res.status(400).json({ error: 'Dados incompletos para envio' });
  }

  const TOKEN = '7676057131:AAELLtx8nzc4F1_PbMGxE-7R3sCvM1lufdM';
  const CHAT_ID = '-4765938730';

  let mensagem = `📦 *Novo Pedido de Materiais*\n\n`;
  mensagem += `*Contrato:* ${contrato}\n`;
  mensagem += `*Encarregado:* ${encarregado}\n`;
  mensagem += `*Obra:* ${obra}\n`;
  mensagem += `*Solicitante:* ${solicitante}\n`;
  if (os) mensagem += `*OS:* ${os}\n`;
  mensagem += `\n*Materiais:*\n`;

  materiais.forEach((item) => {
    mensagem += `• ${item.nome} - ${item.quantidade} ${item.unidade || 'un'}\n`;
  });

  try {
    const telegramRes = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: mensagem,
        parse_mode: 'Markdown',
      }),
    });

    if (!telegramRes.ok) {
      const text = await telegramRes.text();
      throw new Error(`Erro ao enviar mensagem: ${text}`);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Erro ao enviar para o Telegram:', err);
    res.status(500).json({ error: 'Erro ao enviar pedido ao Telegram' });
  }
}
