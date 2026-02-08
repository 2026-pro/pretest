// 1. 중복 선언 방지를 위해 var를 쓰거나 window 객체에 담습니다.
window._SB_URL = 'https://wmrcfbokxwnvdimdjsiu.supabase.co';
window._SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtcmNmYm9reHdudmRpbWRqc2l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0Njg4OTAsImV4cCI6MjA4NjA0NDg5MH0.GakGokV9cocWusj8YDQXyADxiQbBorUilQTgR1bPSdk';

// 2. 초기화 로직 단순화
if (!window.supabaseInstance) {
    try {
        if (window.supabase) {
            window.supabaseInstance = window.supabase.createClient(window._SB_URL, window._SB_KEY);
            console.log('✅ Supabase 인스턴스가 성공적으로 생성되었습니다.');
        }
    } catch (e) {
        console.error('❌ 초기화 중 에러 발생:', e);
    }
}

// 3. 문제의 테스트 함수 수정 (불필요한 자동 실행 방지)
async function testSupabaseConnection() {
    const sb = window.supabaseInstance;
    if (!sb) return;

    try {
        // 실제 존재하는 테이블인 'admins'로 테스트합니다.
        const { data, error } = await sb.from('admins').select('count', { count: 'exact', head: true });
        if (error) throw error;
        console.log('🌐 데이터베이스 연결 상태 양호');
    } catch (error) {
        console.warn('⚠️ 연결 테스트 중 알림:', error.message);
    }
}