# Novo backend com uso de SQLite e cobertura completa de funcionalidades
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from datetime import datetime

app = Flask(__name__)
CORS(app)

DB_NAME = 'database.db'

# Inicializa banco de dados
def init_db():
    conn = sqlite3.connect(DB_NAME)
    cur = conn.cursor()
    cur.execute('''
        CREATE TABLE IF NOT EXISTS reservas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            mesa INTEGER NOT NULL,
            data TEXT NOT NULL,
            hora TEXT NOT NULL,
            pessoas INTEGER NOT NULL,
            confirmada INTEGER DEFAULT 0,
            garcom TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

def perfil_requerido(*perfis):
    def decorator(f):
        def wrapper(*args, **kwargs):
            perfil = (request.json or {}).get("perfil")
            if perfil not in perfis:
                return jsonify({"mensagem": "Acesso negado para seu perfil."}), 403
            return f(*args, **kwargs)
        wrapper.__name__ = f.__name__
        return wrapper
    return decorator

@app.route("/reservas", methods=["POST"])
def criar_reserva():
    dados = request.json
    conn = sqlite3.connect(DB_NAME)
    cur = conn.cursor()
    cur.execute("""
        SELECT * FROM reservas WHERE mesa = ? AND data = ? AND hora = ?
    """, (dados['mesa'], dados['data'], dados['hora']))
    if cur.fetchone():
        return jsonify({"mensagem": "Mesa já reservada nesse horário."}), 400

    cur.execute("""
        INSERT INTO reservas (nome, mesa, data, hora, pessoas) VALUES (?, ?, ?, ?, ?)
    """, (dados['nome'], dados['mesa'], dados['data'], dados['hora'], dados['pessoas']))
    conn.commit()
    conn.close()
    return jsonify({"mensagem": "Reserva criada com sucesso."})

@app.route("/reservas", methods=["DELETE"])
def cancelar_reserva():
    dados = request.json
    conn = sqlite3.connect(DB_NAME)
    cur = conn.cursor()
    cur.execute("""
        DELETE FROM reservas WHERE mesa = ? AND data = ? AND hora = ?
    """, (dados['mesa'], dados['data'], dados['hora']))
    if cur.rowcount == 0:
        return jsonify({"mensagem": "Reserva não encontrada."}), 404
    conn.commit()
    conn.close()
    return jsonify({"mensagem": "Reserva cancelada com sucesso."})

@app.route("/confirmar", methods=["POST"])
@perfil_requerido("garcom")
def confirmar_reserva():
    dados = request.json
    conn = sqlite3.connect(DB_NAME)
    cur = conn.cursor()
    cur.execute("""
        UPDATE reservas SET confirmada = 1, garcom = ? WHERE mesa = ? AND data = ? AND hora = ?
    """, (dados.get('garcom', 'não identificado'), dados['mesa'], dados['data'], dados['hora']))
    if cur.rowcount == 0:
        return jsonify({"mensagem": "Reserva não encontrada."}), 404
    conn.commit()
    conn.close()
    return jsonify({"mensagem": "Reserva confirmada com sucesso."})

@app.route("/relatorios/periodo", methods=["POST"])
@perfil_requerido("gerente")
def relatorio_periodo():
    dados = request.json
    inicio, fim = dados['inicio'], dados['fim']
    conn = sqlite3.connect(DB_NAME)
    cur = conn.cursor()
    cur.execute("""
        SELECT * FROM reservas WHERE data BETWEEN ? AND ?
    """, (inicio, fim))
    resultados = cur.fetchall()
    conn.close()
    return jsonify({"reservas": resultados})

@app.route("/relatorios/mesa", methods=["POST"])
@perfil_requerido("gerente")
def relatorio_mesa():
    mesa = request.json['mesa']
    conn = sqlite3.connect(DB_NAME)
    cur = conn.cursor()
    cur.execute("SELECT * FROM reservas WHERE mesa = ?", (mesa,))
    resultados = cur.fetchall()
    conn.close()
    return jsonify({"reservas": resultados})

@app.route("/relatorios/garcom", methods=["POST"])
@perfil_requerido("gerente")
def relatorio_garcom():
    conn = sqlite3.connect(DB_NAME)
    cur = conn.cursor()
    cur.execute("""
        SELECT garcom, COUNT(*) FROM reservas WHERE confirmada = 1 GROUP BY garcom
    """)
    resultados = cur.fetchall()
    conn.close()
    return jsonify({"confirmacoes_por_garcom": resultados})

if __name__ == '__main__':
    app.run(debug=True)