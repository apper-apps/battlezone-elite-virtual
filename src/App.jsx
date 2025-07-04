import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import MainMenu from "@/components/pages/MainMenu";
import GameScreen from "@/components/pages/GameScreen";
import GameOver from "@/components/pages/GameOver";

function App() {
  return (
    <div className="min-h-screen bg-background font-body">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/game" element={<GameScreen />} />
          <Route path="/game-over" element={<GameOver />} />
        </Routes>
      </motion.div>
    </div>
  );
}

export default App;