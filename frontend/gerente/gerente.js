const tipoSelect = document.getElementById('tipo');
const filtrosDiv = document.getElementById('filtros');
const form = document.getElementById('relatorio-form');
const resultadoDiv = document.getElementById('resultado-relatorio');

function exibirResultado(dados) {
  const div = document.getElementById('resultado-relatorio');
  div.innerHTML = ''; // limpa antes

  if (dados.reservas) {
    const tabela = document.createElement('table');
    tabela.border = 1;

    const thead = tabela.createTHead();
    const cabecalho = thead.insertRow();
    const colunas = Object.keys(dados.reservas[0] || {});
    colunas.forEach(col => {
      const th = document.createElement('th');
      th.textContent = col;
      cabecalho.appendChild(th);
    });

    const tbody = tabela.createTBody();
    dados.reservas.forEach(reserva => {
      const linha = tbody.insertRow();
      colunas.forEach(col => {
        const celula = linha.insertCell();
        celula.textContent = reserva[col];
      });
    });

    div.appendChild(tabela);
  } else if (dados.confirmacoes_por_garcom) {
    const tabela = document.createElement('table');
    tabela.border = 1;

    const thead = tabela.createTHead();
    const cabecalho = thead.insertRow();
    ['garcom', 'total'].forEach(col => {
      const th = document.createElement('th');
      th.textContent = col;
      cabecalho.appendChild(th);
    });

    const tbody = tabela.createTBody();
    dados.confirmacoes_por_garcom.forEach(linha => {
      const tr = tbody.insertRow();
      ['garcom', 'total'].forEach(col => {
        const celula = tr.insertCell();
        celula.textContent = linha[col];
      });
    });

    div.appendChild(tabela);
  } else {
    div.textContent = 'Nenhum dado encontrado.';
  }
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
