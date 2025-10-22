import './styles/css/App.css'

import SceneCanvas from './components/SceneCanvas'
import MainScene from './components/MainScene'

function App() {

  
  return (
    <>
      <SceneCanvas>
        <MainScene />  
      </SceneCanvas>
    </>
  )
}

export default App
