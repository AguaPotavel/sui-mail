# SuiMail 📮

Uma aplicação de comunicação descentralizada construída na blockchain Sui, oferecendo funcionalidades de email e chat com recursos sociais integrados.

## 🏗️ Arquitetura do Projeto

Este projeto utiliza uma arquitetura modular com três componentes principais:

- **Contratos Inteligentes** (`contracts/`) - Smart contracts em Sui Move
- **Cliente Web** (`client/`) - Frontend em Next.js com React
- **SDK TypeScript** (`sdk/`) - Biblioteca para interação com os contratos

## 📁 Estrutura do Projeto

```
sui-mail/
├── contracts/          # Smart contracts Sui Move
│   ├── sources/
│   │   ├── chat/       # Módulos de chat
│   │   ├── mailbox/    # Módulos de email/mailbox
│   │   ├── social/     # Módulos sociais
│   │   └── events.move # Definições de eventos
│   ├── build/          # Artefatos compilados
│   └── Move.toml       # Configuração do projeto Move
├── client/             # Aplicação web frontend
│   ├── src/
│   │   ├── app/        # App Router do Next.js
│   │   ├── components/ # Componentes React
│   │   ├── hooks/      # Custom hooks
│   │   ├── providers/  # Context providers
│   │   └── sui/        # Integrações Sui
│   └── package.json
├── sdk/                # SDK TypeScript
│   ├── src/
│   │   ├── chat/       # Módulos de chat
│   │   ├── mailbox/    # Módulos de mailbox
│   │   ├── social/     # Módulos sociais
│   │   └── constants.ts
│   └── package.json
└── README.md
```

## 🚀 Funcionalidades

### 📧 Sistema de Email
- Envio e recebimento de emails on-chain
- Configuração de mailbox personalizada
- Sistema de taxas configurável

### 💬 Sistema de Chat
- Criação de salas de chat
- Mensagens em tempo real na blockchain
- Configuração de chat personalizada

### 👥 Funcionalidades Sociais
- Perfis de usuário
- Sistema de reputação
- Interações sociais

## 🛠️ Tecnologias Utilizadas

- **Blockchain**: Sui Network
- **Smart Contracts**: Sui Move
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Estado**: Tanstack Query
- **Blockchain Integration**: @mysten/dapp-kit, @mysten/sui
- **Desenvolvimento**: TypeScript, ESLint, Jest

## 🔧 Pré-requisitos

- [Sui CLI](https://docs.sui.io/guides/developer/getting-started/sui-install)
- Node.js (versão 18+)
- pnpm (recomendado)

## 📦 Instalação

### 1. Clone o repositório
```bash
git clone <repo-url>
cd sui-mail
```

### 2. Configure os contratos Sui Move
```bash
cd contracts
sui move build
```

### 3. Configure o SDK
```bash
cd ../sdk
pnpm install
pnpm run build
```

### 4. Configure o cliente web
```bash
cd ../client
pnpm install
```

## 🚀 Desenvolvimento

### Executar testes dos contratos
```bash
cd contracts
sui move test
```

### Executar o cliente em desenvolvimento
```bash
cd client
pnpm run dev
```

O cliente estará disponível em `http://localhost:3000`

### Construir o SDK
```bash
cd sdk
pnpm run build
```

## 📋 Scripts Disponíveis

### Cliente (`client/`)
- `pnpm dev` - Inicia servidor de desenvolvimento
- `pnpm build` - Constrói a aplicação para produção
- `pnpm start` - Inicia servidor de produção
- `pnpm lint` - Executa linting

### SDK (`sdk/`)
- `pnpm build` - Compila o TypeScript
- `pnpm test` - Executa testes (a ser implementado)

### Contratos (`contracts/`)
- `sui move build` - Compila os contratos
- `sui move test` - Executa testes dos contratos

## 🎯 Deploy

### Contratos Sui Move
```bash
cd contracts
sui client publish --gas-budget 100000000
```

### Cliente Web
```bash
cd client
pnpm build
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🔗 Links Úteis

- [Sui Documentation](https://docs.sui.io/)
- [Sui Move Documentation](https://docs.sui.io/concepts/sui-move-concepts)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)