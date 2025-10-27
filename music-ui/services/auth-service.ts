const USERNAME_KEY = 'auth_username';
const PASSWORD_KEY = 'auth_password';

export default class AuthService
{
    static get username(): string | null
    {
        return localStorage.getItem(USERNAME_KEY);
    }

    static async setCredentials(username: string, password: string)
    {
        localStorage.setItem(USERNAME_KEY, username);
        localStorage.setItem(PASSWORD_KEY, password);
    }

    static getBasicAuthHeader(): string
    {
        const username = localStorage.getItem(USERNAME_KEY);
        const password = localStorage.getItem(PASSWORD_KEY);
        if (username != null && password != null)
        {
            const credentials = `${username}:${password}`;
            return 'Basic ' + btoa(credentials);
        }
        return '';
    }
}