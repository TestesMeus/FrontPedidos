import React, { useState } from 'react';
import styled from 'styled-components';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Title>Login - Perfil-X Construtora</Title>
        <StyledForm onSubmit={handleLogin}>
          <FormGroup>
            <Label>Usuário:</Label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Senha:</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </FormGroup>

          <LoginButton type="submit">Entrar</LoginButton>
        </StyledForm>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;

// Estilos:
const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.primaryDark};
`;

const LoginCard = styled.div`
  background-color: ${({ theme }) => theme.colors.secondaryDark};
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.accentBlue};
  text-align: center;
  margin-bottom: 2rem;
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
`;

const Input = styled.input`
  padding: 0.75rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.accentBlue};
  border-radius: ${({ theme }) => theme.borderRadius};
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.textLight};
    background-color: rgba(255, 255, 255, 0.15);
  }
`;

const LoginButton = styled.button`
  background-color: ${({ theme }) => theme.colors.success};
  color: ${({ theme }) => theme.colors.primaryDark};
  border: none;
  padding: 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.textLight};
    transform: translateY(-2px);
  }
`;
