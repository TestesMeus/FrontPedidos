import React, { useState } from 'react';
import { ThemeProvider, createGlobalStyle, styled } from 'styled-components';
import FormContrato from './components/FormContrato';
import CarrinhoMateriais from './components/CarrinhoMateriais';
import PreviewPedido from './components/PreviewPedido';
import { materiais as dataMateriais } from './data/materiais';

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

function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    contrato: "",
    encarregado: "",
    obra: "",
    solicitante: "",
    os: "" // Adicionei o campo os que estava faltando
  });

  const [categoria, setCategoria] = useState("CIVIL");
  const [itens, setItens] = useState([]);

  const adicionarItem = (item, quantidade) => {
    setItens([...itens, { ...item, quantidade: parseInt(quantidade) }]);
  };

  const removerItem = (index) => {
    setItens(prevItens => prevItens.filter((_, i) => i !== index));
  };

  const enviarParaTelegram = async () => {
    const mensagem = `🏗️ *PEDIDO PERFIL-X* \n\n` +
      `📄 *Contrato:* ${formData.contrato}\n` +
      `👷 *Encarregado:* ${formData.encarregado}\n` +
      `🏭 *Obra:* ${formData.obra}\n` +
      `📋 *Solicitante:* ${formData.solicitante}\n` +
      `📝 *OS:* ${formData.os}\n\n` + // Adicionei a OS na mensagem
      `📦 *Materiais:*\n${itens.map(item =>
        `▸ ${item.nome}: ${item.quantidade} ${item.unidade || 'un'}`
      ).join('\n')}`;

    try {
      const response = await fetch('/api/enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem })
      });

      if (!response.ok) throw new Error('Erro ao enviar');

      alert('✅ Pedido enviado com sucesso!');
      setItens([]);
      setFormData({
        contrato: "",
        encarregado: "",
        obra: "",
        solicitante: "",
        os: ""
      });
      setStep(1);
    } catch (error) {
      console.error('Erro:', error);
      alert('❌ Falha ao enviar pedido.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer>
        {step === 1 && (
          <FormContrato
            formData={formData}
            setFormData={setFormData}
            nextStep={() => setStep(2)}
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