// app/api/auth/[auth0]/route.js
import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export const GET =  handleAuth({
    login: handleLogin({
        authorizationParams: {
        audience: 'http://localhost:8000', // or AUTH0_AUDIENCE
        // Add the `offline_access` scope to also get a Refresh Token
        scope: 'openid profile email user' // or AUTH0_SCOPE
        }
    })
});