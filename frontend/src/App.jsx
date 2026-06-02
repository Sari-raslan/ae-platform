import "./style.css";
import PostLaunchPanel from "./ui/PostLaunchPanel.jsx";

export default function App() {
  return (
    <main>
      <h1>Universal Arranger OS</h1>
      <p className="ok">Post-Launch Auto Update + Feedback + Purchase Pipeline Online</p>
      <PostLaunchPanel />
    </main>
  );
}
