-- Criar tabela de Processos
CREATE TABLE Process (
    id SERIAL PRIMARY KEY,  -- ID autoincremental do processo
    name VARCHAR(255) NOT NULL,  -- Nome do processo
    logical_clock INT NOT NULL DEFAULT 0  -- Relógio lógico inicializado em 0
);

-- Criar tabela de Eventos
CREATE TABLE Event (
    id SERIAL PRIMARY KEY,  -- ID autoincremental do evento
    process_id INT NOT NULL,  -- Referência ao processo que criou o evento
    logical_clock INT NOT NULL,  -- Relógio lógico no momento do evento
    description TEXT,  -- Descrição opcional do evento
    FOREIGN KEY (process_id) REFERENCES Process(id) ON DELETE CASCADE  -- Relacionamento com a tabela Process
);

-- Criar tabela de Mensagens
CREATE TABLE Message (
    id SERIAL PRIMARY KEY,  -- ID autoincremental da mensagem
    source_id INT NOT NULL,  -- ID do processo remetente
    destination_id INT NOT NULL,  -- ID do processo destinatário
    logical_clock INT NOT NULL,  -- Relógio lógico no momento da mensagem
    message TEXT NOT NULL,  -- Conteúdo da mensagem
    FOREIGN KEY (source_id) REFERENCES Process(id) ON DELETE CASCADE,  -- Relacionamento com o processo remetente
    FOREIGN KEY (destination_id) REFERENCES Process(id) ON DELETE CASCADE  -- Relacionamento com o processo destinatário
);

-- Criar um índice para melhorar a busca de eventos e mensagens por processo
CREATE INDEX idx_event_process_id ON Event (process_id);
CREATE INDEX idx_message_source_id ON Message (source_id);
CREATE INDEX idx_message_destination_id ON Message (destination_id);