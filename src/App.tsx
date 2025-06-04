import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [response, setResponse] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost/api/test')
      .then((res: Response) => {
        console.log('Status:', res.status);
        return res.text();
      })
      .then((text: string) => setResponse(text))
      .catch((err: Error) => setResponse(err.message));
  }, []);

  return (
    <div>
      <h1>API Response Test</h1>
      <pre>{response || 'Loading...'}</pre>
    </div>
  )
}

export default App
