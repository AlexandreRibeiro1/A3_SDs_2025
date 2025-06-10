# Relatório do Projeto A3 - Sistemas Distribuídos e Mobile

## Equipe

- Lucas Gaspar Vieira - RA: 12724136365 

- João Paulo Souza Fontes - RA: 12724113272 

- Vinicius de Jesus Rocha Reis - RA: 12724120214 

- Witan Mendes Paixão Nascimento de Jesus - RA: 12724123796 

- Alexandre Ribeiro da Silva e Silva - RA: 12724133597 

- Rafael Felipe Resende Santos - RA: 1272419793

## Título do Projeto

Sistema de Reserva de Mesas para Restaurante (Cliente-Servidor)

## Descrição Geral

Este projeto implementa um sistema distribuído com três tipos de clientes (atendente, garçom e gerente) que interagem com um servidor central através de uma API REST para gerenciar reservas de mesas em um restaurante. O sistema permite cadastrar, cancelar, confirmar e consultar reservas.

## Tecnologias Utilizadas

* **Linguagem:** Python 3
* **Framework Backend:** Flask
* **Banco de Dados:** SQLite
* **Frontend:** HTML, CSS, JavaScript puro
* **Comunicação Cliente-Servidor:** API REST (HTTP + JSON)

## Requisitos de Software

* Python 3.10+
* Navegador moderno (Chrome, Firefox etc.)

### Bibliotecas Python utilizadas (instalar via `pip install -r requirements.txt`):

* flask
* flask-cors

## Instruções de Instalação e Execução

1. Navegue até a pasta `backend` no terminal.
2. (Opcional) Crie e ative um ambiente virtual:

   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/macOS
   venv\Scripts\activate     # Windows
   ```
3. Instale as dependências:

   ```bash
   pip install -r requirements.txt
   ```
4. Execute o servidor Flask:

   ```bash
   python app.py
   ```
5. Acesse os clientes abrindo os arquivos HTML diretamente pelo navegador:

   * `frontend/atendente/index.html`
   * `frontend/garcom/garcom.html`
   * `frontend/gerente/gerente.html`

## Funcionalidades por Perfil

### Atendente

* Cadastra reservas informando: nome, mesa, data, hora, número de pessoas.
* Cancela reservas por mesa, data e hora.

### Garçom

* Confirma a ocupação de uma reserva.
* Informa seu nome para registrar quem realizou a confirmação.

### Gerente

* Solicita três tipos de relatórios:

  1. Reservas entre duas datas (confirmadas ou não).
  2. Reservas para uma determinada mesa.
  3. Quantidade de confirmações realizadas por cada garçom.

## Justificativa da Tecnologia de Comunicação

Optamos por utilizar uma **API REST com Flask** pela sua simplicidade, flexibilidade e ampla documentação. Essa abordagem permite uma comunicação leve entre clientes e servidor, com o uso de HTTP e JSON, e facilita testes, manutenção e extensão futura do sistema.

## Considerações Finais

O projeto cumpre todos os requisitos do enunciado e demonstra a aplicação de conceitos de sistemas distribuídos, persistência de dados, interfaces simples para usuários distintos e segregação de funcionalidades por perfil.