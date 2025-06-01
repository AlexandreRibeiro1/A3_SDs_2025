const tipoSelect = document.getElementById('tipo');
const filtrosDiv = document.getElementById('filtros');
const form = document.getElementById('relatorio-form');
const resultadoDiv = document.getElementById('resultado-relatorio');

// URL base do servidor — altere conforme necessário
const API_URL = 'http://localhost:5000/relatorios';

// Atualiza os filtros com base no tipo de relatório
tipoSelect.addEventListener('change', () => {
  const tipo = tipoSelect.value;
  filtrosDiv.innerHTML = '';

  if (tipo === 'periodo') {
    filtrosDiv.innerHTML = `
      <input type="date" id="data-inicio" required placeholder="Data Início">
      <input type="date" id="data-fim" required placeholder="Data Fim">
    `;
  } else if (tipo === 'mesa') {
    filtrosDiv.innerHTML = `
      <input type="number" id="numero-mesa" required placeholder="Número da Mesa">
    `;
  } else if (tipo === 'garcom') {
    filtrosDiv.innerHTML = `
      <input type="text" id="nome-garcom" required placeholder="Nome do Garçom">
    `;
  }
});

// Envia a requisição para o servidor
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const tipo = tipoSelect.value;
  let payload = { tipo };

  if (tipo === 'periodo') {
    payload.inicio = document.getElementById('data-inicio').value;
    payload.fim = document.getElementById('data-fim').value;
  } else if (tipo === 'mesa') {
    payload.mesa = parseInt(document.getElementById('numero-mesa').value);
  } else if (tipo === 'garcom') {
    payload.garcom = document.getElementById('nome-garcom').value;
  }

  try {
    const resposta = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      resultadoDiv.innerHTML = `<p style="color:red">${dados.mensagem}</p>`;
    } else {
      if (dados.resultado && dados.resultado.length > 0) {
        const lista = dados.resultado.map(item => `<li>${JSON.stringify(item)}</li>`).join('');
        resultadoDiv.innerHTML = `<ul>${lista}</ul>`;
      } else {
        resultadoDiv.innerHTML = `<p>Nenhum dado encontrado.</p>`;
      }
    }
  } catch (erro) {
    resultadoDiv.innerHTML = `<p style="color:red">Erro ao conectar com o servidor.</p>`;
  }
});
