import axios from "axios";

const BASE_URL = 'https://roasted-revolve.glitch.me';

const getUser = async (token) => {
    try {
        const response = await axios({
            method: 'get',
            url: `${BASE_URL}/users/me`,
            headers: { 'x-auth': token }
        });
        return response;
    } catch (error) {
        return error;
    }
}

const logOut = async (token) => await axios.delete(`${BASE_URL}/users/me/token`, { headers: { 'x-auth': token } });

const signUpUser = async (email, password) => {
    try {
        const response = await axios({
            method: 'post',
            url: `${BASE_URL}/users`,
            data: { email, password }
        });
        return response;
    } catch (error) {
        return error;
    }
}

const logInUser = async (email, password) => {
    try {
        const response = await axios({
            method: 'post',
            url: `${BASE_URL}/users/login`,
            data: { email, password }
        });
        return response;
    } catch (error) {
        return error;
    }
}



export {
    getUser,
    logOut,
    signUpUser,
    logInUser
}