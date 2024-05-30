import { useEffect } from "react";

interface User {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    request: string;
}

export default function CheckSignedIn(): void {
    const apiUrl = process.env.NEXT_PUBLIC_DEV_BACKEND;

    useEffect(() => {
        const checkSignIn = async () => {
            try {
                const response = await fetch(`${apiUrl}/@me`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include", // Important for sending cookies
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data: User = await response.json();
                console.log(data);
            } catch (error) {
                console.error("Error checking sign in:", error);
            }
        };

        checkSignIn();
    }, [apiUrl]);
}
