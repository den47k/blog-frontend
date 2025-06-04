import { useEffect, useState } from 'react'

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
    <div className='flex flex-col items-center justify-center h-screen text-center'>
      <h1 className='text-4xl font-bold mb-4'>API Response Test</h1>
      <pre>{response || 'Loading...'}</pre>
    </div>
  )
}

export default App
