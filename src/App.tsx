import { useEffect, useState } from 'react'
import useApi from './hooks/useApi';

function App() {
  const [response, setResponse] = useState<any>(null);
  const { loading, post } = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await post('/test');
        setResponse(data);
      } catch (err) {
        console.error('Failed to load messages', err);
        setResponse('Failed to load messages');
      }
    };

    fetchData();
  }, []);

  return (
    <div className='flex flex-col items-center justify-center h-screen text-center'>
      <h1 className='text-4xl font-bold mb-4'>API Response Test</h1>
      <pre>
        {loading 
          ? 'Loading...' 
          : typeof response === 'string' 
            ? response 
            : JSON.stringify(response)}
      </pre>

      <button onClick={() => {
        post('/test')
      }}>huy</button>
    </div>
  )
}

export default App