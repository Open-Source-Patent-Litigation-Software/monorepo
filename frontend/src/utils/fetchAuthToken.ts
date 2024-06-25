export const fetchAuthToken = async () => {
    try {
        const response = await fetch('https://dev-giv3drwd5zd1cqsb.us.auth0.com/oauth/token', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: String(process.env.AUTH0_CLIENT_ID),
            client_secret: String(process.env.AUTH0_CLIENT_SECRET),
            audience: 'http://localhost:8000', // Replace with your actual audience
            }),
        });
    
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        return data.access_token;
    } catch (error) {
        throw error;
    }
  };