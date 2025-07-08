import { create } from 'zustand';

interface AuthState {
    accessToken: string | null; //토큰
    isLoggedIn: boolean; //로그인 여부
    setToken: (token: string) => void; //변수 설정 메서드
    logout: () => void; //로그아웃 메서드
}

const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    isLoggedIn: false,

    setToken: (token) => set({
        accessToken: token,
        isLoggedIn: true,
    }),

    logout: () => set({
        accessToken: null,
        isLoggedIn: false,
    })

}));

export default useAuthStore;