import "./style.css";
import YamahaCASMPanel from "./ui/YamahaCASMPanel.jsx";

export default function App() {
  return (
    <main>
      <h1>Universal Arranger OS</h1>
      <p className="ok">Yamaha CASM Parser Foundation Online</p>
      <YamahaCASMPanel />
    </main>
  );
}
