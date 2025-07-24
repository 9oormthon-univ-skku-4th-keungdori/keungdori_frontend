import api from './api';

const authApi = {
    logout: () => {
        return api.post('auth/logout');
    }
};

export default authApi;