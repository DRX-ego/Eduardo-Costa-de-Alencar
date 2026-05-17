# 🐦‍⬛ UrubuBet - Ganhe no Pix

Bem-vindo à **UrubuBet**, a casa de apostas mais malandra e divertida da internet! Comandada pelo nosso mascote **Urubu de Boné**, esta plataforma oferece uma experiência de cassino moderna, rápida e totalmente brasileira.

## 🚀 Funcionalidades Principais

- **🎰 Urubuzinho Slots:** Gire os rolos e combine símbolos como o Urubu, o Boné e o Dinheiro para ganhar prêmios multiplicados.
- **🎡 Roleta Malandra:** Uma versão simplificada e emocionante da roleta, focada em apostas no Vermelho (Red) ou Verde (Jackpot).
- **💡 Urubu Tips:** Dicas geradas em tempo real por IA (Gemini) para te ajudar a "sentir o feeling" do mercado.
- **🔐 Autenticação Segura:** Login via Google integrado com Firebase.
- **📱 Responsividade Total:** Jogue no PC, tablet ou celular com a mesma qualidade e fluidez.
- **⚡ Saldo em Tempo Real:** Sincronização instantânea de saldo e apostas via Firestore.

## 🛠️ Stack Tecnológica

### Frontend
- **React 19:** O estado da arte em bibliotecas de interface.
- **Tailwind CSS 4:** Estilização moderna e ultra-rápida.
- **Framer Motion:** Animações fluidas e interações premium.
- **Lucide React:** Ícones elegantes e consistentes.

### Backend & Serviços
- **Express.js:** Servidor robusto para lógica de jogo autoritativa.
- **Firebase Auth:** Gerenciamento de usuários seguro.
- **Cloud Firestore:** Banco de dados NoSQL em tempo real.
- **Google Gemini API:** IA generativa para comentários e dicas personalizadas.

## 📦 Como Instalar e Rodar

1. **Clone o repositório:**
   ```bash
   git clone [url-do-repositorio]
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz (baseado no `.env.example`) com suas chaves:
   - `GEMINI_API_KEY`: Sua chave da API do Google AI.
   - Configurações do Firebase em `firebase-applet-config.json`.

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Para produção:**
   ```bash
   npm run build
   npm start
   ```

## 🛡️ Segurança

- As regras do Firestore estão configuradas para garantir que usuários só possam alterar seus próprios dados.
- Lógica de resultados de jogos processada no servidor (Server-Side) para evitar manipulações no cliente.

## 🦜 O Mascote

O **Urubu de Boné** não é apenas um logo, é um lifestyle. Ele usa boné azul marinho, chinelo e está sempre de olho na sua sorte. Siga as dicas dele (ou não), a sorte é sua!

---
*Aviso: Este é um projeto de demonstração técnica. Jogue com responsabilidade.*
