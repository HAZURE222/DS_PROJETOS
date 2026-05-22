from flask import Flask, request, jsonify
from datetime import datetime

app = Flask(__name__)

usuarios = []

@app.route("/registrar", methods=["POST"])
def registrar():

    dados = request.json

    usuario = {
        "nome": dados["nome"],
        "email": dados["email"],
        "empresa": dados["empresa"],
        "senha": dados["senha"],
        "criado_em": datetime.now().strftime("%d/%m/%Y %H:%M:%S")
    }

    usuarios.append(usuario)

    return jsonify({
        "mensagem": "Usuário registrado com sucesso",
        "usuario": usuario
    })
