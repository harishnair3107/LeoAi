import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('user')) } catch (e) { return null }
    })
    const [token, setToken] = useState(() => localStorage.getItem('token'))

    useEffect(() => {
        if (user) localStorage.setItem('user', JSON.stringify(user));
        else localStorage.removeItem('user');
    }, [user])

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token])

    async function login(email, password) {
        const res = await axios.post('/api/auth/login', { email, password })
        if (res.data.error) throw new Error(res.data.error);
        setUser(res.data.user)
        setToken(res.data.token)
        return res
    }

    async function register(name, email, password, otp) {
        const res = await axios.post('/api/auth/register', { name, email, password, otp })
        if (res.data.error) throw new Error(res.data.error);
        setUser(res.data.user)
        setToken(res.data.token)
        return res
    }

    async function sendOtp(email) {
        const res = await axios.post('/api/auth/send-otp', { email })
        if (res.data.error) throw new Error(res.data.error);
        return res
    }

    async function logout() {
        setUser(null)
        setToken(null)
    }

    return (<AuthContext.Provider value={{ user, token, login, register, sendOtp, logout }}>{children}</AuthContext.Provider>)
}