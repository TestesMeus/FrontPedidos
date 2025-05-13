import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Importante para usar `formidable`
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const form = new formidable.IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Erro ao processar formulário:', err);
      return res.status(500).json({ error: 'Erro ao processar dados' });
    }

    const { contrato, encarregado, obra, solicitante, os, observacao } = fields;
    let materiais;

    try {
      materiais = JSON.parse(fields.materiais);
    } catch {
      return res.status(400).json({ error: 'Materiais inválidos' });
    }

    if (!contrato || !encarregado || !obra || !solicitante || !materiais || materiais.length === 0) {
      return res.status(400).json({ error: 'Dados incompletos para envio' });
    }

    const TOKEN = '7676057131:AAELLtx8nzc4F1_PbMGxE-7R3sCvM1lufdM';
    const CHAT_ID = '-4765938730';

    // 🧾 Montar mensagem
    let mensagem = `📦 *Novo Pedido de Materiais*\n\n`;
    mensagem += `*Contrato:* ${contrato}\n`;
    mensagem += `*Encarregado:* ${encarregado}\n`;
    mensagem += `*Obra:* ${obra}\n`;
    mensagem += `*Solicitante:* ${solicitante}\n`;
    if (os) mensagem += `*OS:* ${os}\n`;
    if (observacao) mensagem += `*Observação:* ${observacao}\n`;
    mensagem += `\n*Materiais:*\n`;

    materiais.forEach((item) => {
      mensagem += `• ${item.nome} - ${item.quantidade} ${item.unidade || 'un'}\n`;
    });

    try {
      // Envia a mensagem de texto
      const msgRes = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: mensagem,
          parse_mode: 'Markdown',
        }),
      });

      if (!msgRes.ok) {
        const text = await msgRes.text();
        throw new Error(`Erro ao enviar mensagem: ${text}`);
      }

      // Se houver imagem, envia separadamente
      if (files.anexo) {
        const fileStream = fs.createReadStream(files.anexo.filepath);

        const formData = new FormData();
        formData.append('chat_id', CHAT_ID);
        formData.append('caption', '📎 Anexo do pedido');
        formData.append('photo', fileStream);

        const uploadRes = await fetch(`https://api.telegram.org/bot${TOKEN}/sendPhoto`, {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) {
          const text = await uploadRes.text();
          throw new Error(`Erro ao enviar imagem: ${text}`);
        }
      }

      res.status(200).json({ success: true });
    } catch (err) {
      console.error('❌ Erro ao enviar para o Telegram:', err);
      res.status(500).json({ error: 'Erro ao enviar pedido ao Telegram' });
    }
  });
}
