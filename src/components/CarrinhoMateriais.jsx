import React, { useState } from "react";
import styled from "styled-components";

const CarrinhoMateriais = ({
  categoria,
  setCategoria,
  materiais,
  adicionarItem,
  nextStep,
  voltar
}) => {
  const [quantidades, setQuantidades] = useState({});

  const handleQuantidadeChange = (itemId, value) => {
    setQuantidades((prev) => ({
      ...prev,
      [itemId]: value,
    }));
  };

  const handleAdicionarItem = (e, item) => {
    e.preventDefault();
    const quantidade = quantidades[item.id] || 0;

    if (quantidade > 0) {
      adicionarItem(item, parseInt(quantidade));
      setQuantidades((prev) => ({
        ...prev,
        [item.id]: "",
      }));
    }
  };

  return (
    <CarrinhoContainer>
      <CarrinhoTitle>Materiais - {categoria}</CarrinhoTitle>
      <TopBar>
  <VoltarButton onClick={voltar}>← Voltar</VoltarButton>
  <CategoriaSelect
    value={categoria}
    onChange={(e) => setCategoria(e.target.value)}
  >
    <option value="CIVIL">Civil</option>
    <option value="PINTURA">Pintura</option>
  </CategoriaSelect>
</TopBar>

      <MateriaisList>
        {materiais.map((item) => (
          <MaterialItem key={item.id}>
            <MaterialForm onSubmit={(e) => handleAdicionarItem(e, item)}>
              <MaterialName>
                {item.nome} ({item.unidade})
              </MaterialName>

              <QuantidadeInput
                type="number"
                min="1"
                value={quantidades[item.id] || ""}
                onChange={(e) =>
                  handleQuantidadeChange(item.id, e.target.value)
                }
                placeholder="Qtd"
              />

              <AdicionarButton
                type="submit"
                disabled={!quantidades[item.id] || quantidades[item.id] <= 0}
              >
                Adicionar
              </AdicionarButton>
            </MaterialForm>
          </MaterialItem>
        ))}
      </MateriaisList>

      <FinalizarButton onClick={nextStep}>Finalizar Pedido</FinalizarButton>
    </CarrinhoContainer>
  );
};

// Estilos com styled-components
const CarrinhoContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.secondaryDark};
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.accentBlue};
`;

const CarrinhoTitle = styled.h2`
  color: ${({ theme }) => theme.colors.accentBlue};
  margin-top: 0;
`;

const CategoriaSelect = styled.select`
  padding: 0.75rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.accentBlue};
  border-radius: ${({ theme }) => theme.borderRadius};
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1rem;
  appearance: none; /* Remove o estilo padrão do sistema */
  -webkit-appearance: none; /* Para navegadores baseados no WebKit (Chrome, Safari) */
  -moz-appearance: none; /* Para Firefox */
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a7c5eb'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.5rem;
  padding-right: 2.5rem; /* Espaço para a seta */

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.textLight};
    background-color: rgba(255, 255, 255, 0.15);
  }

  /* Estilo para as opções */
  option {
    background-color: ${({ theme }) => theme.colors.secondaryDark};
    color: ${({ theme }) => theme.colors.textLight};
  }

  /* Remove o fundo azul padrão no Chrome quando selecionado */
  &:focus option:checked {
    background: ${({ theme }) => theme.colors.accentBlue};
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const MateriaisList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
`;

const MaterialItem = styled.li`
  background-color: rgba(167, 197, 235, 0.1);
  padding: 1rem;
  margin-bottom: 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  border-left: 3px solid ${({ theme }) => theme.colors.accentBlue};
`;

const MaterialForm = styled.form`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MaterialName = styled.span`
  flex: 1;
  color: ${({ theme }) => theme.colors.textLight};
`;

const QuantidadeInput = styled.input`
  width: 80px;
  padding: 0.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.accentBlue};
  color: ${({ theme }) => theme.colors.textLight};
  border-radius: ${({ theme }) => theme.borderRadius};
  text-align: center;
`;

const AdicionarButton = styled.button`
  background-color: ${({ theme }) => theme.colors.accentBlue};
  color: ${({ theme }) => theme.colors.primaryDark};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:disabled {
    background-color: ${({ theme }) => theme.colors.textMuted};
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.textLight};
  }
`;

const FinalizarButton = styled.button`
  background-color: ${({ theme }) => theme.colors.success};
  color: white;
  border: none;
  padding: 0.75rem;
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: #3daa58;
    transform: translateY(-2px);
  }
`;
const VoltarButton = styled.button`
  background-color: ${({ theme }) => theme.colors.textMuted};
  color: ${({ theme }) => theme.colors.textLight};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 1rem;

  &:hover {
    background-color: ${({ theme }) => theme.colors.warning};
  }
`;
const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export default CarrinhoMateriais;
