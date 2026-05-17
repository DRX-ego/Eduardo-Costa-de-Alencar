import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Gemini for "Urubu Tips" or commentary
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const ai = genAI; // alias for compatibility if needed

// Game Logic Endpoints (Server-Authoritative)
app.post("/api/games/spin-slot", async (req, res) => {
  const { betAmount } = req.body;
  if (!betAmount || betAmount <= 0) return res.status(400).json({ error: "Invalid bet amount" });

  const symbols = ["🐯", "💰", "💎", "🎰", "🔥", "🌈"];
  const grid = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => symbols[Math.floor(Math.random() * symbols.length)]));

  // Simpler win logic for now: middle row match
  let winMultiplier = 0;
  if (grid[1][0] === grid[1][1] && grid[1][1] === grid[1][2]) {
    winMultiplier = symbols.indexOf(grid[1][0]) + 2; // Arbitrary multiplier
  }

  const winAmount = betAmount * winMultiplier;
  res.json({ grid, winAmount, winMultiplier });
});

app.post("/api/games/roll-roulette", async (req, res) => {
  const { bets } = req.body; // bets: { [type]: amount } e.g. { "red": 10, "number-5": 5 }
  const resultNumber = Math.floor(Math.random() * 37);
  const resultColor = resultNumber === 0 ? "green" : [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(resultNumber) ? "red" : "black";

  let totalWin = 0;
  let totalBet = 0;

  for (const [type, amount] of Object.entries(bets as Record<string, number>)) {
    totalBet += amount;
    if (type === resultColor) {
      totalWin += amount * 2;
    } else if (type === "even" && resultNumber !== 0 && resultNumber % 2 === 0) {
      totalWin += amount * 2;
    } else if (type === "odd" && resultNumber % 2 !== 0) {
      totalWin += amount * 2;
    } else if (type === `number-${resultNumber}`) {
      totalWin += amount * 36;
    }
  }

  res.json({ resultNumber, resultColor, totalWin, totalBet });
});

app.get("/api/tiger-tips", async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Você é o Urubu, um mascote de cassino brasileiro malandro, usa boné azul marinho e chinelo. Dê uma dica curta e engraçada (máximo 15 palavras) para um jogador que quer ganhar na UrubuBet. Use emojis de urubu (🐦‍⬛), boné (🧢) e dinheiro (💸).",
    });
    res.json({ tip: response.text || "O Urubu tá de olho! 🐦‍⬛🧢" });
  } catch (error) {
    res.json({ tip: "O Urubu tá de olho! 🐦‍⬛🧢 A sorte vai pousar na sua conta!" });
  }
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
