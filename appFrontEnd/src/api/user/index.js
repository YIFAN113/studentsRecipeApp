export const login = async (username, password) => {
    const response = await fetch('http://10.0.2.2:8080/api/users', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'post',
        body: JSON.stringify({ username: username, password: password })
    });
    return response.json();
};