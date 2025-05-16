import React from 'react';
import styled from 'styled-components';
import { FaTrashAlt } from 'react-icons/fa';

const PreviewPedido = ({ formData, itens, voltar, removerItem }) => {
  const resetarFluxo = () => window.location.reload();

  const enviarParaTelegram = async () => {
    const payload = {
      contrato: formData.contrato,
      encarregado: formData.encarregado,
      obra: formData.obra,
      solicitante: formData.solicitante,
      os: formData.os || '',
      materiais: itens,
    };

    try {
      const response = await fetch('/api/enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Pedido enviado ao grupo do Telegram!');
        resetarFluxo();
      } else {
        alert('❌ Falha no envio: ' + (data.error || 'Erro desconhecido'));
      }
    } catch (error) {
      alert('❌ Erro na conexão: ' + error.message);
    }
  };

  return (
    <PreviewContainer>
      <PreviewTitle>Confirme o Pedido</PreviewTitle>

      <InfoGroup><InfoLabel>Contrato:</InfoLabel><InfoValue>{formData.contrato}</InfoValue></InfoGroup>
      <InfoGroup><InfoLabel>Encarregado:</InfoLabel><InfoValue>{formData.encarregado}</InfoValue></InfoGroup>
      <InfoGroup><InfoLabel>Obra:</InfoLabel><InfoValue>{formData.obra}</InfoValue></InfoGroup>
      <InfoGroup><InfoLabel>Solicitante:</InfoLabel><InfoValue>{formData.solicitante}</InfoValue></InfoGroup>
      <InfoGroup><InfoLabel>OS:</InfoLabel><InfoValue>{formData.os}</InfoValue></InfoGroup>

      <MateriaisTitle>Materiais:</MateriaisTitle>
      <MateriaisList>
        {itens.map((item, index) => (
          <MaterialPreview key={index}>
            <MaterialInfo>
              <MaterialNome>{item.nome}</MaterialNome>
              <MaterialQuantidade>{item.quantidade} {item.unidade}</MaterialQuantidade>
            </MaterialInfo>
            <DeleteButton onClick={() => removerItem(index)} aria-label={`Remover ${item.nome}`}>
              <FaTrashAlt />
            </DeleteButton>
          </MaterialPreview>
        ))}
      </MateriaisList>

      <BotoesContainer>
        <VoltarButton onClick={voltar}>← Voltar</VoltarButton>
        <ConfirmarButton onClick={enviarParaTelegram} disabled={itens.length === 0}>
          Confirmar e Enviar
        </ConfirmarButton>
      </BotoesContainer>
    </PreviewContainer>
  );
};

export default PreviewPedido;

// Styled-components (os mesmos que você já tinha, sem os relacionados a observação/anexo)
const PreviewContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.primaryDark};
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.accentBlue};
  overflow-x: auto;
  max-width: 100%;
  box-sizing: border-box;
`;

const PreviewTitle = styled.h2`
  color: ${({ theme }) => theme.colors.accentBlue};
  border-bottom: 1px solid ${({ theme }) => theme.colors.accentBlue};
  padding-bottom: 0.5rem;
`;

const InfoGroup = styled.div`
  display: flex;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accentBlue};
  width: 120px;
`;

const InfoValue = styled.span`
  color: ${({ theme }) => theme.colors.textLight};
`;

const MateriaisTitle = styled.h3`
  color: ${({ theme }) => theme.colors.accentBlue};
  margin-top: 1.5rem;
`;

const MateriaisList = styled.div`
  background-color: rgba(167, 197, 235, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 1rem;
  margin-top: 1rem;
`;

const MaterialPreview = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px dashed rgba(167, 197, 235, 0.3);
  color: ${({ theme }) => theme.colors.textLight};

  &:last-child {
    border-bottom: none;
  }
`;

const MaterialInfo = styled.div`
  display: flex;
  flex-grow: 1;
`;

const MaterialNome = styled.span`
  flex: 2;
`;

const MaterialQuantidade = styled.span`
  flex: 1;
  text-align: right;
  padding-right: 1rem;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.error};
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
`;

const BotoesContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const VoltarButton = styled.button`
  background-color: red;
  color: ${({ theme }) => theme.colors.textLight};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  font-weight: 600;
  flex: 1;
`;

const ConfirmarButton = styled.button`
  background-color: ${({ theme }) => theme.colors.success};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  font-weight: 600;
  flex: 2;

  &:disabled {
    background-color: ${({ theme }) => theme.colors.textMuted};
    cursor: not-allowed;
    opacity: 0.7;
  }
`;
