import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Chatbot from './Chatbot.tsx'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <main className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-4 flex items-center justify-center">
      <Chatbot />
    </main>
  </StrictMode>
);
