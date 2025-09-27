import { create } from 'zustand';

interface AuthState {
    accessToken: string | null; //토큰
    isLoggedIn: boolean; //로그인 여부
    setToken: (token: string | null) => void; //변수 설정 메서드
    logout: () => void; //로그아웃 메서드
}

const useAuthStore = create<AuthState>((set) => ({ //로그인 토큰, 상태 저장하는 전역 저장소
    accessToken: null,
    isLoggedIn: true,

    setToken: (token) => set({
        accessToken: token,
        isLoggedIn: true,
    }),

    logout: () => set({
        accessToken: null,
        isLoggedIn: true,
    })

}));

export default useAuthStore;