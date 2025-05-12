import axios from 'axios';

export const api = axios.create({
baseURL: 'http://localhost:5000/api/auth', 
headers: {
    Accept: 'application/json',
},  

});
export const setAuthToken = (token) => {
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};
