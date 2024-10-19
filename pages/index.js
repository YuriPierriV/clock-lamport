import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [processes, setProcesses] = useState([]);
  const [newProcessName, setNewProcessName] = useState('');
  const [selectedSourceProcess, setSelectedSourceProcess] = useState('');
  const [selectedDestinationProcess, setSelectedDestinationProcess] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [alert, setAlert] = useState({ message: '', type: '' });

  useEffect(() => {
    fetchProcesses();
  }, []);

  // Função para exibir alertas
  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert({ message: '', type: '' }); // Limpa a mensagem após 3 segundos
    }, 10000);
  };

  const fetchProcesses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/process');
      setProcesses(response.data);
    } catch (error) {
      showAlert('Erro ao buscar processos!', 'danger');
    }
  };

  const createProcess = async () => {
    if (!newProcessName) {
      showAlert('Nome do processo é obrigatório.', 'warning');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/v1/process', { name: newProcessName });
      setProcesses([...processes, response.data]);
      setNewProcessName('');
      showAlert(`Processo "${response.data.name}" criado com sucesso!`, 'success');
    } catch (error) {
      showAlert('Erro ao criar processo!', 'danger');
    }
  };

  const createEvent = async (processId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/v1/process/${processId}/event`);
      showAlert(`Evento criado: ${response.data.description}`, 'success');
      fetchProcesses();
    } catch (error) {
      showAlert('Erro ao criar evento!', 'danger');
    }
  };

  const sendMessage = async () => {
    if (!selectedSourceProcess || !selectedDestinationProcess || !messageContent) {
      showAlert('Selecione o remetente, destinatário e insira uma mensagem.', 'warning');
      return;
    }
    try {
      const response = await axios.post(`http://localhost:5000/api/v1/process/${selectedSourceProcess}/message`, {
        destination_id: selectedDestinationProcess,
        message: messageContent,
      });
      showAlert(`Mensagem enviada: ${response.data.message}`, 'success');
      fetchProcesses();
    } catch (error) {
      showAlert('Erro ao enviar mensagem!', 'danger');
    }
  };

  return (
    <main className='container mt-5' >
      {alert.message && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show alert-position w-50`} role="alert">
          {alert.message}
          <button type="button" className="btn-close" onClick={() => setAlert({ message: '', type: '' })} aria-label="Close"></button>
        </div>
      )}
      <h1 className="text-center mb-4">Visualização de Processos</h1>



      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-center">Criar Novo Processo</h3>
              <form>
                <div className="mb-3">
                  <label htmlFor="formProcessName" className="form-label">Nome do Processo</label>
                  <input
                    type="text"
                    className="form-control"
                    id="formProcessName"
                    value={newProcessName}
                    onChange={(e) => setNewProcessName(e.target.value)}
                    placeholder="Digite o nome do processo"
                  />
                </div>
                <button type="button" className="btn btn-primary w-100" onClick={createProcess}>
                  Criar Processo
                </button>
              </form>
            </div>
          </div>

          <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-center">Enviar Mensagem entre Processos</h3>
              <div className='mb-3'>
                <label className='form-label'>Processo Remetente</label>
                <select
                  className='form-select'
                  value={selectedSourceProcess}
                  onChange={(e) => setSelectedSourceProcess(e.target.value)}
                >
                  <option value=''>Selecione o processo remetente</option>
                  {processes.map((process) => (
                    <option key={process.id} value={process.id}>
                      {process.name} (ID: {process.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className='mb-3'>
                <label className='form-label'>Processo Destinatário</label>
                <select
                  className='form-select'
                  value={selectedDestinationProcess}
                  onChange={(e) => setSelectedDestinationProcess(e.target.value)}
                >
                  <option value=''>Selecione o processo destinatário</option>
                  {processes.map((process) => (
                    <option key={process.id} value={process.id}>
                      {process.name} (ID: {process.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className='mb-3'>
                <label className='form-label'>Mensagem</label>
                <input
                  type="text"
                  className="form-control"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Digite a mensagem"
                />
              </div>

              <button className="btn btn-success w-100" onClick={sendMessage}>
                Enviar Mensagem
              </button>
            </div>
          </div>
        </div>

        <div className='col-md-6'>
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Lista de Processos</h3>
              <table className='table table-hover'>
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Relógio Lógico</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {processes.map((process) => (
                    <tr key={process.id}>
                      <td>{process.id}</td>
                      <td>{process.name}</td>
                      <td>{process.logical_clock}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => createEvent(process.id)}
                        >
                          Criar Evento
                        </button>
                        <button
                          className="btn btn-secondary btn-sm me-2"
                          onClick={() => setSelectedSourceProcess(process.id)}
                        >
                          Remetente
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSelectedDestinationProcess(process.id)}
                        >
                          Destinatário
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
