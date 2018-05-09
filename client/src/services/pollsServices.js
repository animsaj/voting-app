import axios from "axios";

const BASE_URL = 'https://roasted-revolve.glitch.me';

const getPolls = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/polls`);
        return response.data;
    } catch (error) {
        return error;
    }
}

const getPoll = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/polls/${id}`);
        return response.data;
    } catch (error) {
        return error;
    }
}

const votePoll = async (pollId, optionId) => {
    try {
        const response = await axios.post(`${BASE_URL}/polls/${pollId}`, {
            id: optionId
        });
        return response;
    } catch (error) {
        return error;
    }
}



export {
    getPolls,
    getPoll,
    votePoll
}