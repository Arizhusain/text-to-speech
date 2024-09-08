import AudioProvider from "./Context"
import AppOwner from "./components/AppOwner"
import './App.css';

const App = () => {
  return (
    <>
      <AudioProvider>
        <AppOwner />
      </AudioProvider>
    </>
  )
}

export default App