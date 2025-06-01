from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import wraps

app = Flask(__name__)
CORS(app)

reservas = []

def perfil_requerido(*perfis):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            perfil = (request.json or {}).get("perfil")
            if perfil not in perfis:
                return jsonify({"mensagem": "Acesso negado para seu perfil."}), 403
            return f(*args, **kwargs)
        return wrapper
    return decorator

@app.route("/reservas", methods=["POST"])
def criar_reserva():
    dados = request.json
    if any(r["mesa"] == dados["mesa"] and r["data"] == dados["data"] for r in reservas):
        return jsonify({"mensagem": "Mesa já reservada nesse horário."}), 400
    reservas.append(dados)
    return jsonify({"mensagem": "Reserva criada com sucesso."})

@app.route("/reservas", methods=["DELETE"])
def cancelar_reserva():
    dados = request.json
    for r in reservas:
        if r["mesa"] == dados["mesa"] and r["data"] == dados["data"]:
            reservas.remove(r)
            return jsonify({"mensagem": "Reserva cancelada com sucesso."})
    return jsonify({"mensagem": "Reserva não encontrada."}), 404

@app.route("/confirmar", methods=["POST"])
@perfil_requerido("garcom")
def confirmar_reserva():
    dados = request.json
    for r in reservas:
        if r["mesa"] == dados["mesa"] and r["data"] == dados["data"]:
            r["confirmada"] = True
            return jsonify({"mensagem": "Reserva confirmada com sucesso."})
    return jsonify({"mensagem": "Reserva não encontrada."}), 404

# troquei para POST para receber JSON confortavelmente
@app.route("/relatorios", methods=["POST"])
@perfil_requerido("gerente")
def relatorios():
    total = len(reservas)
    confirmadas = sum(r.get("confirmada") for r in reservas)
    return jsonify({
        "total_reservas": total,
        "confirmadas": confirmadas,
        "nao_confirmadas": total - confirmadas,
        "reservas": reservas
    })

if __name__ == "__main__":
    app.run(debug=True)
