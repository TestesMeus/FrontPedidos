import React, { useState } from 'react';
import styled from 'styled-components';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from '../assets/P-X.png'


const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };


  return (
    <LoginContainer>
      <LoginCard>
      <Logo src={logo} alt="Logo Perfil-X" />
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
  <PasswordWrapper>
    <Input
      type={showPassword ? 'text' : 'password'}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Digite sua senha"
      required
    />
    <ToggleButton type="button" onClick={() => setShowPassword(!showPassword)}>
    {showPassword ? <FaEyeSlash /> : <FaEye />}
    </ToggleButton>
  </PasswordWrapper>
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

const PasswordWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const ToggleButton = styled.button`
  position: absolute;
  right: 10px;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  height: 100%;
  display: flex;
  align-items: center;

  &:hover {
    color: ${({ theme }) => theme.colors.accentBlue};
  }
`;

const Logo = styled.img`
  width: 120px;
  display: block;
  margin: 0 auto 1rem auto;
`;