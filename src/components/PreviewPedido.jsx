import React, { useState } from 'react';

import styled from 'styled-components';
import { FaTrashAlt } from 'react-icons/fa';

const PreviewPedido = ({ formData, itens, voltar, removerItem }) => {
  const [observacao, setObservacao] = useState('');
const [anexo, setAnexo] = useState(null);
  
  const resetarFluxo = () => {
    window.location.reload();
  };
  
const API_URL = '/api/enviar-pedido'
console.log('🔍 API_URL usada:', API_URL);

const enviarParaTelegram = async () => {
  const formDataToSend = new FormData();

  formDataToSend.append('contrato', formData.contrato);
  formDataToSend.append('encarregado', formData.encarregado);
  formDataToSend.append('obra', formData.obra);
  formDataToSend.append('solicitante', formData.solicitante);
  formDataToSend.append('os', formData.os);
  formDataToSend.append('materiais', JSON.stringify(itens));
  formDataToSend.append('observacao', observacao);
  if (anexo) {
    formDataToSend.append('anexo', anexo);
  }

  try {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Authorization': 'PRe' // Apenas Authorization, sem Content-Type com FormData
      },
      body: formDataToSend
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

      <InfoGroup>
        <InfoLabel>Contrato:</InfoLabel>
        <InfoValue>{formData.contrato}</InfoValue>
      </InfoGroup>

      <InfoGroup>
        <InfoLabel>Encarregado:</InfoLabel>
        <InfoValue>{formData.encarregado}</InfoValue>
      </InfoGroup>

      <InfoGroup>
        <InfoLabel>Obra:</InfoLabel>
        <InfoValue>{formData.obra}</InfoValue>
      </InfoGroup>

      <InfoGroup>
        <InfoLabel>Solicitante:</InfoLabel>
        <InfoValue>{formData.solicitante}</InfoValue>
      </InfoGroup>

      <InfoGroup>
        <InfoLabel>OS:</InfoLabel>
        <InfoValue>{formData.os}</InfoValue>
      </InfoGroup>

      <MateriaisTitle>Materiais:</MateriaisTitle>
      <MateriaisList>
        {itens.map((item, index) => (
          <MaterialPreview key={index}>
            <MaterialInfo>
              <MaterialNome>{item.nome}</MaterialNome>
              <MaterialQuantidade>
                {item.quantidade} {item.unidade}
              </MaterialQuantidade>
            </MaterialInfo>
            <DeleteButton
              onClick={() => removerItem(index)}
              aria-label={`Remover ${item.nome}`}
            >
              <FaTrashAlt />
            </DeleteButton>
          </MaterialPreview>
        ))}
      </MateriaisList>
      <InfoGroup>
  <InfoLabel>Observações:</InfoLabel>
  <TextArea
    placeholder="Digite observações adicionais..."
    value={observacao}
    onChange={(e) => setObservacao(e.target.value)}
  />
</InfoGroup>

<InfoGroup>
  <InfoLabel>Anexos (imagens):</InfoLabel>
  <FileInputWrapper>
    <FileLabel htmlFor="fileUpload">
      <ClipIcon>📎</ClipIcon> Selecionar imagem
    </FileLabel>
    <FileInput
      id="fileUpload"
      type="file"
      accept="image/*"
      onChange={(e) => setAnexo(e.target.files[0])}
    />
    {anexo && <FileName>{anexo.name}</FileName>}
  </FileInputWrapper>
</InfoGroup>

      <BotoesContainer>
        <VoltarButton onClick={voltar}>
          ← Voltar
        </VoltarButton>
        <ConfirmarButton
          onClick={enviarParaTelegram}
          disabled={itens.length === 0}
        >
          Confirmar e Enviar
        </ConfirmarButton>
      </BotoesContainer>
    </PreviewContainer>
  );
};

// Estilos com styled-components
const PreviewContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.primaryDark};
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.accentBlue};
  overflow-x: auto;
  max-width: 100%;
  box-sizing: border-box;
  @media (max-width: 480px) {
    padding: 1rem;
    border: none;
    background-color: transparent;
  }
`;

const PreviewTitle = styled.h2`
  color: ${({ theme }) => theme.colors.accentBlue};
  border-bottom: 1px solid ${({ theme }) => theme.colors.accentBlue};
  padding-bottom: 0.5rem;
  margin-top: 0;
`;

const InfoGroup = styled.div`
  display: flex;
  margin-bottom: 1rem;
  flex-wrap: wrap;

  @media (max-width: 500px) {
    flex-direction: column;
    align-items: flex-start;
  }
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
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
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
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  min-height: 44px;
  min-width: 44px;

  &:hover {
    color: ${({ theme }) => theme.colors.warning};
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
  @media (max-width: 480px) {
    align-self: flex-end;
  }
`;

const BotoesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 500px) {
    flex-direction: column;
  }
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
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.warning};
  }
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
  transition: all 0.3s ease;
  min-height: 50px;

  &:hover:not(:disabled) {
    background-color: #3daa58;
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.textMuted};
    cursor: not-allowed;
    opacity: 0.7;
  }
  @media (max-width: 480px) {
    width: 100%;
  }
`;

export default PreviewPedido;

const TextArea = styled.textarea`
  resize: vertical;
  padding: 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.accentBlue};
  background-color: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.textLight};
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.textLight};
    background-color: rgba(255, 255, 255, 0.15);
  }
`;

const FileInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FileLabel = styled.label`
  display: inline-flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.accentBlue};
  color: ${({ theme }) => theme.colors.primaryDark};
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: ${({ theme }) => theme.colors.textLight};
  }
`;

const ClipIcon = styled.span`
  margin-right: 8px;
`;

const FileInput = styled.input`
  display: none;
`;

const FileName = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

