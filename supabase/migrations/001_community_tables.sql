-- ABCD X Community Boards - Supabase Schema
-- 실행: Supabase Dashboard > SQL Editor에서 실행

-- 1. 공지사항 (notices)
CREATE TABLE notices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_by TEXT DEFAULT '관리자',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 공지사항 첨부파일 (notice_files)
CREATE TABLE notice_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  notice_id UUID NOT NULL REFERENCES notices(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. 자료실 (library)
CREATE TABLE library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  view_count INTEGER DEFAULT 0,
  created_by TEXT DEFAULT '관리자',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. 자료실 첨부파일 (library_files)
CREATE TABLE library_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  library_id UUID NOT NULL REFERENCES library(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Q&A (qna)
CREATE TABLE qna (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT,
  author_email TEXT,
  view_count INTEGER DEFAULT 0,
  answer TEXT,
  answered_at TIMESTAMPTZ,
  answered_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 인덱스
CREATE INDEX idx_notices_created_at ON notices(created_at DESC);
CREATE INDEX idx_notices_is_pinned ON notices(is_pinned);
CREATE INDEX idx_notice_files_notice_id ON notice_files(notice_id);
CREATE INDEX idx_library_created_at ON library(created_at DESC);
CREATE INDEX idx_library_files_library_id ON library_files(library_id);
CREATE INDEX idx_qna_created_at ON qna(created_at DESC);

-- updated_at 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notices_updated_at
  BEFORE UPDATE ON notices
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER library_updated_at
  BEFORE UPDATE ON library
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER qna_updated_at
  BEFORE UPDATE ON qna
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- RLS (Row Level Security) 정책
-- 개발 단계: 모든 작업 허용. 배포 시 Supabase Auth 연동 후 정책 수정 필요
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE notice_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE library ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE qna ENABLE ROW LEVEL SECURITY;

-- 공지사항: 모두 읽기, 인증된 사용자만 쓰기 (auth 추가 전까지 모든 작업 허용)
CREATE POLICY "notices_select" ON notices FOR SELECT USING (true);
CREATE POLICY "notices_insert" ON notices FOR INSERT WITH CHECK (true);
CREATE POLICY "notices_update" ON notices FOR UPDATE USING (true);
CREATE POLICY "notices_delete" ON notices FOR DELETE USING (true);

-- 공지사항 첨부파일
CREATE POLICY "notice_files_select" ON notice_files FOR SELECT USING (true);
CREATE POLICY "notice_files_insert" ON notice_files FOR INSERT WITH CHECK (true);
CREATE POLICY "notice_files_delete" ON notice_files FOR DELETE USING (true);

-- 자료실
CREATE POLICY "library_select" ON library FOR SELECT USING (true);
CREATE POLICY "library_insert" ON library FOR INSERT WITH CHECK (true);
CREATE POLICY "library_update" ON library FOR UPDATE USING (true);
CREATE POLICY "library_delete" ON library FOR DELETE USING (true);

-- 자료실 첨부파일
CREATE POLICY "library_files_select" ON library_files FOR SELECT USING (true);
CREATE POLICY "library_files_insert" ON library_files FOR INSERT WITH CHECK (true);
CREATE POLICY "library_files_delete" ON library_files FOR DELETE USING (true);

-- Q&A: 모두 읽기/쓰기 (질문 등록), 답변은 업데이트로
CREATE POLICY "qna_select" ON qna FOR SELECT USING (true);
CREATE POLICY "qna_insert" ON qna FOR INSERT WITH CHECK (true);
CREATE POLICY "qna_update" ON qna FOR UPDATE USING (true);

-- Storage 버킷 생성 (Supabase Dashboard > Storage에서 수동 생성 권장)
-- 버킷명: notice-files, library-files
-- Public: true (또는 signed URL 사용 시 false)
