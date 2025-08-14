import api from './api';

const authApi = {
    logout: () => {
        return api.post('auth/logout', undefined, {
            headers: { 'Content-Type': undefined }
        });
    }
};

export default authApi;