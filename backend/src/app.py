from flask import Flask, jsonify, request, abort
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Banco de dados simples em memória
processes = {}
events = []
messages = []
process_id_counter = 1

def find_process(process_id):
    return processes.get(process_id)

# Rota para adicionar um novo processo
@app.route('/api/v1/process', methods=['POST'])
def create_process():
    global process_id_counter
    data = request.get_json()
    name = data.get('name')

    if not name:
        abort(400, description="Nome do processo é obrigatório.")

    new_process = {
        'id': process_id_counter,
        'name': name,
        'logical_clock': 0
    }

    processes[process_id_counter] = new_process
    process_id_counter += 1

    return jsonify(new_process), 201

# Rota para listar todos os processos
@app.route('/api/v1/process', methods=['GET'])
def list_processes():
    return jsonify(list(processes.values())), 200

# Rota para criar um evento local em um processo
@app.route('/api/v1/process/<int:process_id>/event', methods=['POST'])
def create_event(process_id):
    process = find_process(process_id)
    if process is None:
        abort(404, description="Processo não encontrado.")

    process['logical_clock'] += 1

    new_event = {
        'id': len(events) + 1,
        'process_id': process_id,
        'logical_clock': process['logical_clock'],
        'description': f"Evento local no processo {process_id}"
    }

    events.append(new_event)
    return jsonify(new_event), 201  # Mudei o código de status para 201 (Criado)

# Rota para enviar uma mensagem de um processo para outro
@app.route('/api/v1/process/<int:process_id>/message', methods=['POST'])
def send_message(process_id):
    process = find_process(process_id)
    if process is None:
        abort(404, description="Processo remetente não encontrado.")

    data = request.get_json()
    destination_id = data.get('destination_id')
    message_content = data.get('message')

    if destination_id is None or message_content is None:
        abort(400, description="ID do destinatário e mensagem são obrigatórios.")

    destination_process = find_process(destination_id)
    if destination_process is None:
        abort(404, description="Processo destinatário não encontrado.")

    # Atualiza os relógios lógicos
    process['logical_clock'] += 1
    destination_process['logical_clock'] = max(destination_process['logical_clock'], process['logical_clock']) + 1

    # Registra a mensagem
    new_message = {
        'id': len(messages) + 1,
        'source_id': process_id,
        'destination_id': destination_id,
        'logical_clock': destination_process['logical_clock'],
        'message': message_content
    }

    messages.append(new_message)

    # Adiciona um evento para a mensagem enviada
    event_description = f"Mensagem enviada de {process_id} para {destination_id}: {message_content}"
    new_event = {
        'id': len(events) + 1,
        'process_id': process_id,
        'logical_clock': process['logical_clock'],
        'description': event_description
    }
    
    events.append(new_event)

    return jsonify(new_message), 201

# Rota para listar todos os eventos
@app.route('/api/v1/events', methods=['GET'])
def list_events():
    return jsonify(events), 200

# Rota para listar todas as mensagens
@app.route('/api/v1/messages', methods=['GET'])
def list_messages():
    return jsonify(messages), 200

if __name__ == '__main__':
    app.run(debug=True)
