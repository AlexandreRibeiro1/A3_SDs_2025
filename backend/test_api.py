import requests

# Exemplo de reserva
reserva = {
    "mesa": 5,
    "data": "2025-06-05",
    "nome": "Cliente X",
    "perfil": "garcom"
}

# Criar reserva
resposta = requests.post("http://127.0.0.1:5000/reservas", json=reserva)
print("Criar:", resposta.json())

# Confirmar reserva como garçom
resposta = requests.post("http://127.0.0.1:5000/confirmar", json=reserva)
print("Confirmar:", resposta.json())

# Gerar relatório como gerente
resposta = requests.get("http://127.0.0.1:5000/relatorios", json={"perfil": "gerente"})
print("Relatório:", resposta.json())
