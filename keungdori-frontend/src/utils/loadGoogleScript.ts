const API_KEY = import.meta.env.VITE_GOOGLEMAPS_API_KEY;

const GOOGLE_MAPS_URL = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;

/**
 * 모듈 스코프 변수로 스크립트의 로드 상태를 관리합니다.
 * isScriptLoaded: 스크립트 로딩이 성공적으로 완료되었는지 여부
 * loadingPromise: 스크립트가 로딩 중일 때, 해당 로딩 작업의 Promise 객체
 */
let isScriptLoaded = false;
let loadingPromise: Promise<void> | null = null;

/**
 * Google Maps JavaScript API 스크립트를 동적으로 로드하는 함수입니다.
 * 중복 로드를 방지하는 로직이 포함되어 있습니다.
 * @returns {Promise<void>} 스크립트 로드가 완료되면 resolve되는 Promise 객체
 */
export const loadGoogleScript = (): Promise<void> => {
  // **핵심: 함수가 호출될 때마다 DOM을 직접 확인합니다.**
  if (document.querySelector(`script[src*="maps.googleapis.com/maps/api/js"]`)) {
    // 스크립트 태그가 이미 존재하면, 로드된 것으로 간주하고 즉시 성공 처리합니다.
    return Promise.resolve();
  }
  
  // 1. 이미 스크립트가 로드되었다면, 즉시 성공 처리합니다.
  if (isScriptLoaded) {
    return Promise.resolve();
  }

  // 2. 현재 다른 곳에서 스크립트를 로딩 중이라면, 진행 중인 로딩 Promise를 반환합니다.
  //    이를 통해 여러 곳에서 동시에 호출해도 스크립트 태그는 하나만 생성됩니다.
  if (loadingPromise) {
    return loadingPromise;
  }

  // 3. 스크립트 로딩을 시작하고, 이 작업에 대한 Promise를 생성하여 loadingPromise에 저장합니다.
  loadingPromise = new Promise((resolve, reject) => {
    // <script> 태그를 동적으로 생성합니다.
    const script = document.createElement('script');
    script.src = GOOGLE_MAPS_URL;
    script.async = true; // 비동기 로드
    script.defer = true; // 렌더링 차단 방지

    // 스크립트 로딩 성공 시 실행될 콜백
    script.onload = () => {
      isScriptLoaded = true; // 로드 완료 상태로 변경
      loadingPromise = null; // 로딩 Promise 정리
      console.log("Google Maps script loaded successfully.");
      resolve(); // Promise를 성공으로 완료
    };

    // 스크립트 로딩 실패 시 실행될 콜백
    script.onerror = (error) => {
      loadingPromise = null; // 로딩 Promise 정리
      console.error("Failed to load Google Maps script:", error);
      reject(new Error('Google Maps script failed to load.')); // Promise를 실패로 완료
    };

    // 생성된 <script> 태그를 <head>에 추가하여 로드를 시작합니다.
    document.head.appendChild(script);
  });

  return loadingPromise;
};