import React, { useState } from "react";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";

const CarrinhoMateriais = ({
  categoria,
  setCategoria,
  materiais,
  categorias,
  adicionarItem,
  nextStep,
  voltar,
}) => {
  const [quantidades, setQuantidades] = useState({});
  const [busca, setBusca] = useState("");

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

  const materiaisFiltrados = materiais.filter((item) =>
    item.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <CarrinhoContainer>
      <CarrinhoTitle>Materiais - {categoria}</CarrinhoTitle>

      <TopBar>
        <VoltarButton onClick={voltar}>← Voltar</VoltarButton>
        <CategoriaSelect
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          {Array.isArray(categorias) &&
            categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}
              </option>
            ))}
        </CategoriaSelect>
      </TopBar>

      <BuscaContainer>
        <FaSearch />
        <BuscaInput
          type="text"
          placeholder="Buscar material..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </BuscaContainer>

      <MateriaisList>
        {materiaisFiltrados.map((item) => (
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

// Estilos
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
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a7c5eb'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.5rem;
  padding-right: 2.5rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.textLight};
    background-color: rgba(255, 255, 255, 0.15);
  }

  option {
    background-color: ${({ theme }) => theme.colors.secondaryDark};
    color: ${({ theme }) => theme.colors.textLight};
  }

  &:focus option:checked {
    background: ${({ theme }) => theme.colors.accentBlue};
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const BuscaContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.accentBlue};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 0.5rem 1rem;
  margin: 1rem 0;
  color: ${({ theme }) => theme.colors.textLight};
`;

const BuscaInput = styled.input`
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.textLight};
  margin-left: 0.5rem;
  flex: 1;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
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
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
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
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export default CarrinhoMateriais;
