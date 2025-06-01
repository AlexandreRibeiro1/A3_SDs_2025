import requests

# Exemplo de reserva
reserva = {
    "mesa": 5,
    "data": "2025-06-05",
    "nome": "Cliente X",
    "perfil": "garcom"
}

print("\n=== Testando criação de reserva ===")
resposta = requests.post("http://127.0.0.1:5000/reservas", json=reserva)
print("Status:", resposta.status_code)
print("Resposta:", resposta.json())

print("\n=== Testando confirmação (garçom) ===")
resposta = requests.post("http://127.0.0.1:5000/confirmar", json=reserva)
print("Status:", resposta.status_code)
print("Resposta:", resposta.json())

print("\n=== Testando relatório (gerente) ===")
resposta = requests.get("http://127.0.0.1:5000/relatorios", json={"perfil": "gerente"})
print("Status:", resposta.status_code)
print("Resposta:", resposta.json())

