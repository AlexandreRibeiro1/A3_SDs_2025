const form = document.getElementById('confirmar-form');
const mensagemDiv = document.getElementById('mensagem');

// URL base do servidor — altere se necessário
const API_URL = 'http://localhost:5000/confirmar';

function exibirMensagem(texto, erro = false) {
  mensagemDiv.textContent = texto;
  mensagemDiv.style.color = erro ? 'red' : 'green';
  setTimeout(() => mensagemDiv.textContent = '', 5000);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const dados = {
    mesa: parseInt(document.getElementById('mesa').value),
    data: document.getElementById('data').value
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
