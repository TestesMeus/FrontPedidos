import React, { useState, useEffect } from 'react';
import { ThemeProvider, createGlobalStyle, styled } from 'styled-components';
import FormContrato from './components/FormContrato';
import CarrinhoMateriais from './components/CarrinhoMateriais';
import PreviewPedido from './components/PreviewPedido';
import Login from './components/Login';
import { materiais as dataMateriais } from './data/materiais';
import { usuariosValidos } from './data/users'; // Importando usuários válidos


// Tema e estilos
const theme = {
  colors: {
    primaryDark: '#1a1a2e',
    secondaryDark: '#16213e',
    accentBlue: '#a7c5eb',
    textLight: '#e6f1ff',
    textMuted: '#b8c2d9',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336'
  },
  spacing: {
    small: '0.5rem',
    medium: '1rem',
    large: '2rem'
  },
  borderRadius: '6px'
};

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.colors.primaryDark};
    color: ${({ theme }) => theme.colors.textLight};
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    line-height: 1.6;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 0.5rem;
    font-size: 16px;

    @media (max-width: 480px) {
      padding: 0.25rem;
      align-items: stretch;
    }
  }
  
  * {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }
  
  input, select, textarea, button {
    font-size: 16px;
  }
`;

const AppContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 1rem;
  padding: 1.5rem;
  background-color: ${({ theme }) => theme.colors.secondaryDark};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);

  @media (min-width: 1200px) {
    margin: 2rem auto;
  }

  @media (max-width: 480px) {
    margin: 0.5rem;
    padding: 1rem;
    border-radius: 0;
  }
`;

const LogoutButton = styled.button`
  background-color: ${({ theme }) => theme.colors.error};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  
  &:hover {
    background-color: darkred;
  }
`;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState('');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    contrato: "",
    encarregado: "",
    obra: "",
    solicitante: "",
    os: ""
  });
  const [categoria, setCategoria] = useState("CIVIL");
  const [itens, setItens] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('usuarioLogado');
    if (storedUser) {
      const { username, expiry } = JSON.parse(storedUser);
      const now = new Date();
      if (now.getTime() < expiry) {
        setIsLoggedIn(true);
        setUsuarioLogado(username);
        setFormData(prevFormData => ({
          ...prevFormData,
          encarregado: username
        }));
      } else {
        localStorage.removeItem('usuarioLogado');
      }
    }
  }, []);


  const adicionarItem = (item, quantidade) => {
    setItens([...itens, { ...item, quantidade: parseInt(quantidade) }]);
  };

  const removerItem = (index) => {
    setItens(prevItens => prevItens.filter((_, i) => i !== index));
  };

  const dentroDoHorario = () => {
    const agora = new Date();
    const diaSemana = agora.getDay(); // 0 = domingo, 6 = sábado
    const hora = agora.getHours(); // 0-23
  
    const diaUtil = diaSemana >= 1 && diaSemana <= 5; // Segunda a sexta
    const horarioPermitido = hora >= 7 && hora < 16; // das 7h00 até 15h59
  
    return diaUtil && horarioPermitido;
  };
  

const enviarParaTelegram = async (anexoFile) => {
  if (!dentroDoHorario()) {
    alert('❌ Pedidos só podem ser feitos de segunda a sexta das 7h às 16h!');
    return;
  }

  const formDataEnvio = new FormData();
  formDataEnvio.append('contrato', formData.contrato);
  formDataEnvio.append('encarregado', formData.encarregado);
  formDataEnvio.append('obra', formData.obra);
  formDataEnvio.append('solicitante', formData.solicitante);
  formDataEnvio.append('os', formData.os || '');
  formDataEnvio.append('observacao', formData.observacao || '');
  formDataEnvio.append('materiais', JSON.stringify(itens));

  if (anexoFile) {
    formDataEnvio.append('anexo', anexoFile);
  }

  try {
    const response = await fetch('/api/enviar', {
      method: 'POST',
      body: formDataEnvio,
    });

    if (!response.ok) throw new Error('Erro ao enviar');

    alert('✅ Pedido enviado com sucesso!');
    setItens([]);
    setFormData({
      contrato: "",
      encarregado: usuarioLogado,
      obra: "",
      solicitante: "",
      os: "",
      observacao: ""
    });
    setStep(1);
  } catch (error) {
    console.error('Erro:', error);
    alert('❌ Falha ao enviar pedido.');
  }
};


  const usuariosSemRestricao = ['admin', 'lorrana']



  const handleLogin = (username, password) => {
    const usuario = usuariosValidos[username];
  
    if (usuario && usuario.senha === password) {
      // Se NÃO for admin, verifica o horário
      if (!usuariosSemRestricao.includes(username) && !dentroDoHorario()) {
        alert('⏰ Login só é permitido de segunda a sexta das 7h às 16h!');
        return;
      }
  
      setIsLoggedIn(true);
      setUsuarioLogado(usuario.nome);

      const TEMPO_EXPIRACAO_EM_HORAS = 2; // Aqui você muda para 2h, 4h, 8h, etc.

      const now = new Date();
      const expiryTime = now.getTime() + TEMPO_EXPIRACAO_EM_HORAS * 60 * 60 * 1000;
      localStorage.setItem('usuarioLogado', JSON.stringify({ username: usuario.nome, expiry: expiryTime }));
  
      setFormData(prevFormData => ({
        ...prevFormData,
        encarregado: usuario.nome
      }));
  
    } else {
      alert('Usuário ou senha inválidos!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    setIsLoggedIn(false);
    setUsuarioLogado('');
    setFormData({
      contrato: "",
      encarregado: "",
      obra: "",
      solicitante: "",
      os: ""
    });
    setItens([]);
    setStep(1);
  };



  if (!isLoggedIn) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Login onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer>
      <p>Olá, {usuarioLogado}!</p>
        <LogoutButton onClick={handleLogout}>
         Sair
        </LogoutButton>
        {step === 1 && (
          <FormContrato
            formData={formData}
            setFormData={setFormData}
            nextStep={() => setStep(2)}
            isLoggedIn={isLoggedIn}
          />
        )}
        {step === 2 && (
          <CarrinhoMateriais
            categoria={categoria}
            setCategoria={setCategoria}
            categorias={Object.keys(dataMateriais)}
            materiais={dataMateriais[categoria] || []}
            adicionarItem={adicionarItem}
            nextStep={() => setStep(3)}
            voltar={() => setStep(1)}
            itens={itens}
            removerItem={removerItem}
          />
        )}
        {step === 3 && (
          <PreviewPedido
            formData={formData}
            itens={itens}
            enviarParaTelegram={enviarParaTelegram}
            voltar={() => setStep(2)}
            removerItem={removerItem}
          />
        )}
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
