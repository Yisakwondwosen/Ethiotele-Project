const fetch = require('node-fetch');

(async () => {
  // We need a token. Let's see if we can log in.
  let res = await fetch("https://yisehak.duckdns.org/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "test@test.com", password: "password123" }) // Wait, we don't know the credential
  });
  console.log(await res.text());
})();
