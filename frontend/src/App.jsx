import { useState } from 'react'
import Catetan from './Catetan/Catetan'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Catetan/>
    </>
  )
}

export default App
