const tipoSelect = document.getElementById('tipo');
const filtrosDiv = document.getElementById('filtros');
const form = document.getElementById('relatorio-form');
const resultadoDiv = document.getElementById('resultado-relatorio');

function exibirResultado(dados) {
  resultadoDiv.innerHTML = '<pre>' + JSON.stringify(dados, null, 2) + '</pre>';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const tipo = tipoSelect.value;
  let url = '';
  let payload = { perfil: 'gerente' };

  if (tipo === 'periodo') {
    url = 'http://localhost:5000/relatorios/periodo';
    payload.inicio = document.getElementById('data-inicio').value;
    payload.fim = document.getElementById('data-fim').value;
  } else if (tipo === 'mesa') {
    url = 'http://localhost:5000/relatorios/mesa';
    payload.mesa = parseInt(document.getElementById('numero-mesa').value);
  } else if (tipo === 'garcom') {
    url = 'http://localhost:5000/relatorios/garcom';
  } else {
    return;
  }

  try {
    const resposta = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const dados = await resposta.json();
    exibirResultado(dados);
  } catch (err) {
    resultadoDiv.textContent = 'Erro ao buscar relatório.';
  }
});

// Atualizar filtros
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
    filtrosDiv.innerHTML = `<p>Esse relatório mostra o total de confirmações feitas por cada garçom.</p>`;
  }
});
