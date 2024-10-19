import React, { useState, useEffect } from 'react';
import { XYPlot, MarkSeries, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, Crosshair } from 'react-vis';
import 'react-vis/dist/style.css'; // Importe os estilos
import axios from 'axios';
import Alert from './Alert'; // Importa o novo componente de alerta

function App() {
  const [processes, setProcesses] = useState([]);
  const [newProcessName, setNewProcessName] = useState('');
  const [selectedSourceProcess, setSelectedSourceProcess] = useState('');
  const [selectedDestinationProcess, setSelectedDestinationProcess] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [alert, setAlert] = useState({ message: '', type: '' });

  const [events, setEvents] = useState([]);
  const [crosshair, setCrosshair] = useState({});

  useEffect(() => {
    fetchProcesses();
  }, []);

  useEffect(() => {


    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    }
  };

  // Função para exibir alertas
  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert({ message: '', type: '' }); // Limpa a mensagem após 3 segundos
    }, 3000);
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
      fetchEvents();
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
      fetchEvents();
    } catch (error) {
      showAlert('Erro ao enviar mensagem!', 'danger');
    }
  };

  // Transformar eventos em dados para o gráfico
  const data = events.map(event => ({
    x: event.logical_clock,
    y: event.process_id,
    description: event.description
  }));

  const maxProcessId = events.length > 0 ? Math.max(...events.map(event => event.process_id)) : 0;

  // Obter IDs únicos de processos que têm eventos
  const uniqueProcessIds = [...new Set(data.map(event => event.y))].sort((a, b) => a - b);

  // Obter valores únicos de relogios lógicos que têm eventos
  const uniqueLogicalClocks = [...new Set(data.map(event => event.x))].sort((a, b) => a - b);

  return (
    <div className='h-full w-full'>
      <Alert
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ message: '', type: '' })} // Passa a função de fechar
      />
      <main className='container mt-5' >

        <h1 className="text-center mb-4">Relógio de Lamport</h1>



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
            <div className="card shadow-sm mb-4">
              <div className="card-body">

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
            <div className="card shadow-sm">
              <div className="card-body">

                <XYPlot
                  width={600}
                  height={400}
                  onMouseLeave={() => setCrosshair({})}
                  yDomain={[0, maxProcessId + 1]} // Define o limite do eixo Y como o maior ID + 1
                  xDomain={[0, Math.max(...events.map(event => event.logical_clock), 0) + 1]} // Define o limite do eixo X
                >
                  <VerticalGridLines />
                  <HorizontalGridLines />
                  <XAxis
                    title="Relógio Lógico"
                    tickValues={uniqueLogicalClocks} // Define os ticks do eixo X apenas para os relógios lógicos únicos
                  />
                  <YAxis
                    title="ID do Processo"
                    tickValues={uniqueProcessIds} // Define os ticks do eixo Y apenas para os IDs únicos dos processos
                  />
                  <MarkSeries
                    data={data} // Usando MarkSeries para mostrar pontos discretos
                    onNearestX={value => setCrosshair({ x: value.x, y: value.y })}
                  />
                  <Crosshair values={[crosshair]}>
                    <div
                      className='container bg-light border rounded p-2 text-dark w-100'
                      style={{
                        width: '200px', // Largura fixa
                        whiteSpace: 'nowrap', // Impede quebras de linha
                        overflow: 'hidden', // Esconde texto que ultrapassa a largura
                        textOverflow: 'ellipsis' // Adiciona '...' no final se o texto for muito longo
                      }}
                    >
                      {crosshair.x !== undefined && (
                        <div>
                          <p>ID do Processo: {crosshair.y}</p>
                          <p>
                            {data.find(d => d.x === crosshair.x && d.y === crosshair.y)?.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </Crosshair>
                </XYPlot>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

  );
}

export default App;
