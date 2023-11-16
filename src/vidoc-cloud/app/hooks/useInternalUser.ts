import { useState, useEffect } from "react";

const useInternalUser = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("/api/auth/my-user", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    next: { revalidate: 0 },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    setError(new Error("Failed to fetch user"));
                }
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, isLoading, error };
};

export default useInternalUser;
