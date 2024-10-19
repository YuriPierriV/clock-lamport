# Clock Lamport

Este é o projeto "Clock Lamport", desenvolvido para simular e visualizar conceitos de sistemas distribuídos usando o algoritmo de relógio de Lamport. O projeto usa **Next.js** para a interface e conta com várias dependências para visualização e gerenciamento de estados, incluindo **React**, **React-vis**, e **Axios**. O projeto também depende de um ambiente Docker para rodar serviços.

## Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (versão recomendada no arquivo `.nvmrc`)
- [Docker](https://www.docker.com/)
- [npm](https://www.npmjs.com/)

## Instalação

### 1. Clone o repositório

Primeiro, clone o repositório para a sua máquina local:

```bash
git clone https://github.com/YuriPierriV/clock-lamport.git
cd clock-lamport
```

### 2. Instale as dependências

Em seguida, instale as dependências do projeto com o npm:

```bash
npm install
```
### 3. Suba os serviços do Docker

O projeto depende de alguns serviços que são configurados e gerenciados via Docker. Para iniciar os serviços, execute:

```bash
npm run services:build
```

### 4. Execute o projeto em modo de desenvolvimento

Agora, para iniciar o servidor de desenvolvimento do Next.js, execute o comando:

```bash
npm run dev
```

A aplicação estará disponível em http://localhost:3000.

## Autores

Este projeto foi desenvolvido por:

- **Yuri Pierri** - [GitHub](https://github.com/YuriPierriV)
- **Ednardo Luz** - [GitHub](https://github.com/EdLuz111)



