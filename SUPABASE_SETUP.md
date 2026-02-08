# Supabase + Vercel 연동 가이드

## 1. Supabase 프로젝트 생성

1. [supabase.com](https://supabase.com) 가입 및 로그인
2. New Project 생성
3. 프로젝트 설정에서 **Project URL**과 **anon public** 키 확인

## 2. 테이블 생성

Supabase Dashboard > **SQL Editor**에서 아래 SQL 실행:

```sql
-- supabase/migrations/001_community_tables.sql 파일 내용 전체 복사 후 실행
```

또는 해당 파일 내용을 SQL Editor에 붙여넣고 Run 실행.

## 3. Storage 버킷 생성

1. Supabase Dashboard > **Storage** > New bucket
2. 버킷 생성:
   - `notice-files` (공지사항 첨부파일)
   - `library-files` (자료실 첨부파일)
3. 각 버킷 **Public** 체크 (또는 RLS 정책으로 공개 설정)

## 4. config.js 설정

1. `assets/js/config.example.js`를 `assets/js/config.js`로 복사
2. Supabase Project URL과 anon key 입력:

```javascript
window.SUPABASE_CONFIG = {
  url: 'https://xxxxxxxx.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
};
```

3. `config.js`를 `.gitignore`에 추가 (키 노출 방지):
```
assets/js/config.js
```

## 5. HTML에 스크립트 추가

community/admin 페이지의 `</body>` 직전에 다음 순서로 추가:

```html
<script src="./assets/js/config.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="./assets/js/supabase-client.js"></script>
<script src="./assets/js/community-api.js"></script>
<script src="./assets/js/community-notice.js"></script>
```

(페이지별로 community-notice.js / community-library.js / community-qna.js / admin-notice.js 등 해당 스크립트만 로드)

## 6. Vercel 배포

1. GitHub에 푸시
2. [vercel.com](https://vercel.com)에서 프로젝트 Import
3. Root Directory 확인 후 Deploy
4. (선택) Vercel Dashboard > Settings > Environment Variables 에 SUPABASE_URL, SUPABASE_ANON_KEY 설정 후 config.js에서 읽도록 수정 가능

## 7. RLS 정책 (보안)

현재 모든 작업 허용 상태입니다. 배포 시 Supabase Auth 연동 후 RLS 정책을 수정하여:
- 공지/자료실: INSERT/UPDATE/DELETE는 인증된 관리자만
- Q&A: INSERT는 누구나, UPDATE(answer)는 관리자만
