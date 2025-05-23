import React from 'react';
import styled from 'styled-components';

const FormContrato = ({ formData, setFormData, nextStep, isLoggedIn }) => {
  const contratos = [
    "117/2023 - Esporte Maricá ",
    "267/2023 - Predial Maricá",
    "222/2023 - Escolas Maricá",
    "10/2021 - Eletricá Predial",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.contrato && formData.encarregado && formData.obra && formData.solicitante && formData.os) {
      nextStep();
    }
  };

  return (
    <FormContainer>
      <FormTitle>Dados do Pedido - Perfil-X Construtora</FormTitle>
      <StyledForm onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Contrato*:</Label>
          <Select
            name="contrato"
            value={formData.contrato}
            onChange={handleChange}
            required
          >
            <option value="">Selecione um contrato</option>
            {contratos.map((contrato, index) => (
              <option key={index} value={contrato}>{contrato}</option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Encarregado*:</Label>
          <Input
            type="text"
            name="encarregado"
            value={formData.encarregado}
            onChange={handleChange}
            placeholder="Nome do encarregado"
            required
            readOnly={isLoggedIn} // Aqui o campo ficará bloqueado se já estiver logado
          />
        </FormGroup>

        <FormGroup>
          <Label>Obra*:</Label>
          <Input
            type="text"
            name="obra"
            value={formData.obra}
            onChange={handleChange}
            placeholder="Local/Nome da obra"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Solicitante*:</Label>
          <Input
            type="text"
            name="solicitante"
            value={formData.solicitante}
            onChange={handleChange}
            placeholder="Quem está solicitando"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Ordem de Serviço*:</Label>
          <Input
            type="number"
            name="os"
            value={formData.os}
            onChange={handleChange}
            placeholder="N° Ordem de Serviço"
            required
          />
        </FormGroup>

        <NextButton type="submit">Próximo → Selecionar Materiais</NextButton>
      </StyledForm>
    </FormContainer>
  );
};


// Estilos com styled-components
const FormContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.secondaryDark};
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.accentBlue};
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 600px) {
    padding: 1rem;
  }
  @media (max-width: 480px) {
    padding: 1rem 0.5rem;
    border: none;
    background-color: transparent;
  }
`;


const FormTitle = styled.h2`
  color: ${({ theme }) => theme.colors.accentBlue};
  border-bottom: 1px solid ${({ theme }) => theme.colors.accentBlue};
  padding-bottom: 0.5rem;
  margin-top: 0;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  

`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.accentBlue};
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.accentBlue};
  border-radius: ${({ theme }) => theme.borderRadius};
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1rem;
  min-height: 44px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.textLight};
    background-color: rgba(255, 255, 255, 0.15);
  }
  @media (max-width: 480px) {
    width: 100%;
  }
`;

const Select = styled.select`
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
  min-height: 50px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.textLight};
    background-color: rgba(255, 255, 255, 0.15);
  }
  @media (max-width: 480px) {
    width: 100%;
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

const NextButton = styled.button`
  background-color: ${({ theme }) => theme.colors.success};
  color: ${({ theme }) => theme.colors.primaryDark};
  border: none;
  padding: 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.textLight};
    transform: translateY(-2px);
  }
`;

export default FormContrato;
