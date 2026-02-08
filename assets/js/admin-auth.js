/*
  Admin auth helpers using Supabase table `admins`.
  - createAdmin(admin): create admin (hashes password with bcrypt)
  - authenticateAdmin(id, plainPassword): verify credentials
  - signInAdmin(id, plainPassword): authenticate + set session
  - signOutAdmin(): remove session
  - currentAdmin(): return session admin id

  Note: this uses `bcrypt` (bcryptjs). Ensure bcrypt is loaded on pages
  that call create/authenticate (admin_login.html will load it).
*/
(function (global) {
  const ADMIN_SESSION_KEY = 'admin_session';

  // Supabase 대기함수
  async function waitForSupabase(timeout = 5000) {
    const start = Date.now();
    while (!window.supabaseInstance && Date.now() - start < timeout) {
      await new Promise(r => setTimeout(r, 100));
    }
    if (!window.supabaseInstance) {
      throw new Error('Supabase 초기화 실패');
    }
    return window.supabaseInstance;
  }

  // Bcrypt 대기함수
  async function waitForBcrypt(timeout = 5000) {
    const start = Date.now();
    while (!window.bcrypt && Date.now() - start < timeout) {
      await new Promise(r => setTimeout(r, 100));
    }
    if (!window.bcrypt) {
      throw new Error('Bcrypt 라이브러리 로드 실패');
    }
    return window.bcrypt;
  }

  async function hashPassword(pw) {
    const bcrypt = await waitForBcrypt();
    const saltRounds = 10;
    return await bcrypt.hash(pw, saltRounds);
  }

  async function createAdmin({ id, password, name, organization, email, phone }) {
    if (!id || !password || !name) {
      return { success: false, error: 'id, password and name are required' };
    }
    try {
      const supabl = await waitForSupabase();
      const hashed = await hashPassword(password);
      const payload = {
        id: id,
        password: hashed,
        name: name,
        organization: organization || null,
        email: email || null,
        phone: phone || null
      };
      const { data, error } = await supabl.from('admins').insert([payload]).select('*').single();
      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message || err };
    }
  }

  async function authenticateAdmin(id, plainPassword) {
    try {
      console.log('🔍 DB에서 관리자 조회:', id);
      const supabl = await waitForSupabase();
      const { data, error } = await supabl.from('admins').select('*').eq('id', id).single();
      
      if (error) {
        console.error('❌ DB 조회 오류:', error);
        // 404 에러는 "not found"로 처리
        if (error.code === 'PGRST116' || error.message.includes('No rows found')) {
          return { success: false, error: '아이디를 찾을 수 없습니다' };
        }
        return { success: false, error: error.message || '데이터베이스 오류' };
      }
      
      if (!data) {
        console.warn('⚠️  관리자 정보 없음');
        return { success: false, error: '아이디를 찾을 수 없습니다' };
      }
      
      console.log('✓ 관리자 정보 조회 성공');
      
      const bcrypt = await waitForBcrypt();
      
      console.log('🔐 비밀번호 검증 중...');
      let match = false;
      try {
        match = await bcrypt.compare(plainPassword, data.password);
      } catch (bcErr) {
        console.error('❌ bcrypt 비교 오류:', bcErr);
        return { success: false, error: '비밀번호 검증 중 오류 발생' };
      }
      
      if (!match) {
        console.warn('⚠️  비밀번호 불일치');
        return { success: false, error: '비밀번호가 올바르지 않습니다' };
      }
      
      console.log('✅ 인증 성공');
      return { success: true, data };
      
    } catch (err) {
      console.error('🔴 인증 중 예외:', err);
      return { success: false, error: err.message || '알 수 없는 오류' };
    }
  }

  function signInLocal(adminRow, ttlMs = 1000 * 60 * 60) {
    const session = {
      id: adminRow.id,
      name: adminRow.name,
      created: Date.now(),
      expires: Date.now() + ttlMs
    };
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    return session;
  }

  function signOutAdmin() {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }

  function currentAdmin() {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    try {
      const s = JSON.parse(raw);
      if (!s.expires || Date.now() > s.expires) {
        localStorage.removeItem(ADMIN_SESSION_KEY);
        return null;
      }
      return s;
    } catch (e) {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      return null;
    }
  }

  // signIn helper: authenticate + store session
  async function signInAdmin(id, plainPassword) {
    const res = await authenticateAdmin(id, plainPassword);
    if (!res.success) return res;
    const session = signInLocal(res.data);
    return { success: true, session };
  }

  async function listAdmins() {
    try {
      const supabl = await waitForSupabase();
      const { data, error } = await supabl.from('admins').select('id, name, organization, email, phone, created_at');
      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message || err };
    }
  }

  async function deleteAdmin(id) {
    try {
      const supabl = await waitForSupabase();
      const { error } = await supabl.from('admins').delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || err };
    }
  }

  // Export
  global.adminAuth = {
    createAdmin,
    authenticateAdmin,
    signInAdmin,
    signOutAdmin,
    currentAdmin,
    listAdmins,
    deleteAdmin
  };

})(window);
