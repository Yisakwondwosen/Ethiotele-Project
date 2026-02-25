const { SignJWT, importJWK, decodeJwt } = require('jose');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const FAYDA_CONFIG = {
    authorization_endpoint: "https://esignet.ida.fayda.et/authorize",
    token_endpoint: "https://esignet.ida.fayda.et/v1/esignet/oauth/v2/token",
    userinfo_endpoint: "https://esignet.ida.fayda.et/v1/esignet/oidc/userinfo",
    client_id: process.env.CLIENT_ID || process.env.FAYDA_CLIENT_ID,
    // Callback must match what is registered in Fayda Dashboard
    redirect_uri: 'http://localhost:3000/callback',
    scope: 'openid profile email'
};

// Clean Key Helper
const getCleanKey = () => {
    const key = process.env.PRIVATE_KEY || "";
    return key.replace(/[\n\r\s]/g, '').replace(/-/g, '+').replace(/_/g, '/');
};

async function generateSignedJwt() {
    const privateKey = getCleanKey();
    const clientId = FAYDA_CONFIG.client_id;

    const header = { alg: "RS256", typ: "JWT" };
    const payload = {
        iss: clientId,
        sub: clientId,
        aud: FAYDA_CONFIG.token_endpoint,
        jti: crypto.randomUUID(), // Unique identifier for the assertion
        exp: Math.floor(Date.now() / 1000) + 120 // 2 minutes expiration
    };

    const decodedKey = Buffer.from(privateKey, "base64").toString();
    const jwkObject = JSON.parse(decodedKey);
    const privateKeyJwk = await importJWK(jwkObject, "RS256");

    return new SignJWT(payload)
        .setProtectedHeader(header)
        .setIssuedAt()
        .sign(privateKeyJwk);
}

const login = (req, res) => {
    // Generate Auth URL
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: FAYDA_CONFIG.client_id,
        redirect_uri: FAYDA_CONFIG.redirect_uri,
        scope: FAYDA_CONFIG.scope,
        state: crypto.randomUUID(), // Should verify state in callback for security
        nonce: crypto.randomUUID(),
        ui_locales: 'eng' // Fixes the DOMTokenList theme-config.js bug on Fayda's side
    });

    const url = `${FAYDA_CONFIG.authorization_endpoint}?${params.toString()}`;

    // Redirect directly or return URL
    // Since this is called from Frontend button click, we can redirect directly if opened in same window, 
    // or return JSON if SPA handles navigation. The request is `window.location.href = ...` usually.
    // Let's redirect.
    res.redirect(url);
};

const callback = async (req, res) => {
    const { code, state } = req.query;

    if (!code) {
        return res.status(400).send("Authorization code missing");
    }

    try {
        // 1. Generate Client Assertion
        const client_assertion = await generateSignedJwt();

        // 2. Exchange Code for Tokens
        const tokenResponse = await fetch(FAYDA_CONFIG.token_endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: FAYDA_CONFIG.redirect_uri,
                client_id: FAYDA_CONFIG.client_id,
                client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
                client_assertion
            })
        });

        const tokens = await tokenResponse.json();
        if (!tokens.access_token) {
            console.error("Token Exchange Failed:", tokens);
            throw new Error('Failed to obtain access token from Fayda');
        }

        // 3. Get User Info
        const userInfoResponse = await fetch(FAYDA_CONFIG.userinfo_endpoint, {
            headers: { 'Authorization': `Bearer ${tokens.access_token}` }
        });

        // Fayda UserInfo is a Signed JWT (JWE/JWS)? Or JSON?
        // Index.js logic: `const jwt = await userInfo.data?.text(); decodeJwt(jwt)`
        // So UserInfo endpoint returns a JWT string directly?
        const userInfoRaw = await userInfoResponse.text();
        // Check if it's JSON or JWT
        let userProfile;
        try {
            // Try parsing JSON first (standard)
            userProfile = JSON.parse(userInfoRaw);
        } catch {
            // If Text, it might be JWT
            userProfile = decodeJwt(userInfoRaw);
        }

        console.log("Fayda User Profile:", userProfile);

        const email = userProfile.email || `${userProfile.sub || 'fayda_user'}@fayda.et`;
        const name = userProfile.name || userProfile.given_name || "Fayda User";
        const faydaId = userProfile.sub || userProfile.individual_id;

        // 4. Find or Create User in DB
        let userResult = await pool.query('SELECT * FROM "user" WHERE fayda_id = $1 OR email = $2', [faydaId, email]);
        let user = userResult.rows[0];

        if (!user) {
            // Create User
            const newUser = await pool.query(
                'INSERT INTO "user" (name, email, "emailVerified", fayda_id) VALUES ($1, $2, true, $3) RETURNING id, name, email, fayda_id',
                [name, email, faydaId]
            );
            user = newUser.rows[0];
        } else {
            // Update fayda_id if missing
            if (!user.fayda_id) {
                await pool.query('UPDATE "user" SET fayda_id = $1 WHERE id = $2', [faydaId, user.id]);
                user.fayda_id = faydaId;
            }
        }

        // 5. Generate Session Token for Frontend
        const sessionToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your_jwt_secret', {
            expiresIn: '24h',
        });

        // 6. Redirect to Frontend Dashboard
        res.redirect(`https://yisehak.duckdns.org/dashboard?token=${sessionToken}`);

    } catch (error) {
        // Detailed Logging
        const fs = require('fs');
        const logData = `[${new Date().toISOString()}] Error: ${error.message}\nStack: ${error.stack}\n`;
        fs.appendFileSync('fayda_error.log', logData);

        console.error("Fayda Auth Error:", error);
        res.redirect(`https://yisehak.duckdns.org/login?error=fayda_failed&details=${encodeURIComponent(error.message)}`);
    }
};

module.exports = { login, callback };
