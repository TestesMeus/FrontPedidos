import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaSearch, FaShoppingCart, FaTimes } from "react-icons/fa";

const CarrinhoMateriais = ({
  categoria,
  setCategoria,
  materiais,
  adicionarItem,
  nextStep,
  voltar,
  itens,
  removerItem
}) => {
  const [quantidades, setQuantidades] = useState({});
  const [busca, setBusca] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [pulse, setPulse] = useState(false);

  // Efeito para animação quando um item é adicionado
  useEffect(() => {
    if (itens.length > 0) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 500);
      return () => clearTimeout(timer);
    }
  }, [itens.length]);

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
          <option value="CIVIL">Civil</option>
          <option value="PINTURA">Pintura</option>
        </CategoriaSelect>
        <FinalizarButton onClick={nextStep}>Continuar</FinalizarButton> 
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

      {/* Carrinho flutuante */}
      {itens.length > 0 && (
        <>
      <FloatingCartWrapper $visible={itens.length > 0}>
        <FloatingCartButton 
          onClick={() => setShowCart(!showCart)}
          className={pulse ? 'pulse' : ''}
          aria-label="Ver carrinho"
          $visible={itens.length > 0}
        >
          <FaShoppingCart style={{ fontSize: '32px' }}/>
          {itens.length > 0 && <CartBadge>{itens.length}</CartBadge>}
        </FloatingCartButton>
      </FloatingCartWrapper>
          
          {showCart && (
            <CartPopup>
              <PopupHeader>
                <h3>Seu Pedido ({itens.length} itens)</h3>
                <CloseButton onClick={() => setShowCart(false)}>
                  <FaTimes />
                </CloseButton>
              </PopupHeader>
              <CartItemsList>
                {itens.map((item, index) => (
                  <CartItem key={index}>
                    <ItemInfo>
                      <ItemName>{item.nome}</ItemName>
                      <ItemQty>
                        {item.quantidade} {item.unidade}
                      </ItemQty>
                    </ItemInfo>
                    <RemoveButton onClick={() => removerItem(index)}>
                      <FaTimes />
                    </RemoveButton>
                  </CartItem>
                ))}
              </CartItemsList>
              <PopupFooter>
                <ContinueButton onClick={() => setShowCart(false)}>
                  Continuar Comprando
                </ContinueButton>
                <CheckoutButton onClick={nextStep}>
                  Finalizar Pedido
                </CheckoutButton>
              </PopupFooter>
            </CartPopup>
          )}
        </>
      )}
    </CarrinhoContainer>
  );
};

// Novos estilos para o carrinho flutuante

const FloatingCartWrapper = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: ${({ $visible }) => $visible ? 'block' : 'none'};
  z-index: 1000;
`;

const FloatingCartButton = styled.button`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: #3d3b49;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  font-size: 2rem;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    transform: scale(1.1);
    background-color: ${({ theme }) => theme.colors.textLight};
  }
  
  &.pulse {
    animation: pulse 0.5s ease;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
  
  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    font-size: 1.8rem;
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: ${({ theme }) => theme.colors.error};
  color: white;
  border-radius: 50%;
  width: 28px;  // Aumentei de 24px para 28px
  height: 28px; // Aumentei de 24px para 28px
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem; // Aumentei de 0.8rem para 1rem
  font-weight: bold;
  
  @media (max-width: 768px) {
    width: 24px;  // Aumentei de 20px para 24px
    height: 24px; // Aumentei de 20px para 24px
    font-size: 0.9rem; // Aumentei de 0.7rem para 0.9rem
  }
`;

const CartPopup = styled.div`
  position: fixed;
  bottom: 6rem;
  right: 2rem;
  width: 90%;
  max-width: 400px;
  max-height: 70vh;
  background-color: ${({ theme }) => theme.colors.secondaryDark};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  z-index: 100;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  @media (max-width: 768px) {
    bottom: 5rem;
    right: 1rem;
    width: calc(100% - 2rem);
  }
`;

const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.primaryDark};
  border-bottom: 1px solid ${({ theme }) => theme.colors.accentBlue};
  
  h3 {
    margin: 0;
    color: ${({ theme }) => theme.colors.accentBlue};
    font-size: 1.1rem;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem;
  
  &:hover {
    color: ${({ theme }) => theme.colors.accentBlue};
  }
`;

const CartItemsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid rgba(167, 197, 235, 0.2);
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const ItemQty = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 0.25rem;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.error};
  cursor: pointer;
  padding: 0.5rem;
  font-size: 0.9rem;
  
  &:hover {
    color: ${({ theme }) => theme.colors.warning};
  }
`;

const PopupFooter = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.primaryDark};
  border-top: 1px solid ${({ theme }) => theme.colors.accentBlue};
  gap: 0.5rem;
`;

const ContinueButton = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.accentBlue};
  border: 1px solid ${({ theme }) => theme.colors.accentBlue};
  padding: 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: rgba(167, 197, 235, 0.1);
  }
`;

const CheckoutButton = styled.button`
  background-color: ${({ theme }) => theme.colors.success};
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    background-color: #3daa58;
  }
`;

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
  min-height: 44px;
  flex: 1;

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
  @media (max-width: 480px) {
    width: 100%;
    margin: 0.5rem 0;
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
  min-height: 44px;
  min-width: 100px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
  @media (max-width: 480px) {
    width: 100%;
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
  background-color: red;
  color: ${({ theme }) => theme.colors.textLight};
  border: none;
  padding: 0.75rem;
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
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export default CarrinhoMateriais;