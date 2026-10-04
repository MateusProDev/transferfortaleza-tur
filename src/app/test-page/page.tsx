export default function TestPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Test Page</h1>
      <p style={{ fontSize: '1rem' }}>If you can see this, Next.js routing is working correctly.</p>
      <p style={{ fontSize: '1rem', marginTop: '1rem' }}>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
}
