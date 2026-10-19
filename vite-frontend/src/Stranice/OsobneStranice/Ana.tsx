import { useState } from 'react';
import { Center } from '@mantine/core';

export default function Ana() {
  const [count, setCount] = useState(0);

  return (
    <Center h="100vh">
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={() => setCount(c => c + 1)}
          style={{
            fontSize: 100,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 0.1s',
          }}
          onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.9)')}
          onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          🐱
        </button>

        <div style={{ fontSize: 32, fontWeight: 700, marginTop: 12 }}>
          {count} 🐾
        </div>
      </div>
    </Center>
  );
}