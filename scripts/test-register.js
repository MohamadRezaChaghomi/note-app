(async()=>{
  const ports = [3000,3001];
  for (const port of ports) {
    try {
      const url = `http://127.0.0.1:${port}/api/auth/register`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test User', email: 'test@example.com', password: 'Password123!', recaptchaToken: 'development_token' })
      });
      const text = await res.text();
      console.log('PORT', port, 'STATUS', res.status);
      console.log(text);
    } catch (err) {
      console.log('PORT', port, 'ERROR', err.code || err.message);
    }
  }
})();
