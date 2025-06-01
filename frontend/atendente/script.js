const reservaForm = document.getElementById('reserva-form');
const cancelarForm = document.getElementById('cancelar-form');
const mensagemDiv = document.getElementById('mensagem');

// URL base do servidor — altere se necessário
const API_URL = 'http://localhost:5000/reservas';

// Função para exibir mensagens ao usuário
function exibirMensagem(texto, erro = false) {
  mensagemDiv.textContent = texto;
  mensagemDiv.style.color = erro ? 'red' : 'green';
  setTimeout(() => mensagemDiv.textContent = '', 5000);
}

// Enviar nova reserva
reservaForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const dados = {
    nome: document.getElementById('nome').value,
    mesa: parseInt(document.getElementById('mesa').value),
    pessoas: parseInt(document.getElementById('pessoas').value),
    data: document.getElementById('data').value,
    hora: document.getElementById('hora').value
  };

  try {
    const resposta = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    const resultado = await resposta.json();
    exibirMensagem(resultado.mensagem, !resposta.ok);
  } catch (erro) {
    exibirMensagem('Erro ao conectar com o servidor.', true);
  }
});

// Cancelar reserva
cancelarForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const dados = {
    mesa: parseInt(document.getElementById('cancelar-mesa').value),
    data: document.getElementById('cancelar-data').value
  };

  try {
    const resposta = await fetch(API_URL, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    const resultado = await resposta.json();
    exibirMensagem(resultado.mensagem, !resposta.ok);
  } catch (erro) {
    exibirMensagem('Erro ao conectar com o servidor.', true);
  }
});
