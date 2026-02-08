/**
 * Community API - Supabase 연동
 * 공지사항, 자료실, Q&A CRUD
 */
(function(global) {
  var BUCKET_NOTICE = 'notice-files';
  var BUCKET_LIBRARY = 'library-files';

  function sb() {
    // 우선 전역에 초기화된 클라이언트 인스턴스가 있는지 확인
    if (typeof window !== 'undefined' && window.supabaseInstance) return window.supabaseInstance;
    // 기존 패턴: ABCDX.supabase getter가 제공하는 경우 사용
    if (global.ABCDX && global.ABCDX.supabase) return global.ABCDX.supabase;
    // 마지막으로, supabase 라이브러리(모듈)가 로드되어 있고 설정이 있다면 클라이언트 생성 시도
    if (typeof window !== 'undefined' && window.supabase && window.supabase.createClient) {
      var url = (typeof SUPABASE_URL !== 'undefined') ? SUPABASE_URL : (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url);
      var key = (typeof SUPABASE_KEY !== 'undefined') ? SUPABASE_KEY : (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.anonKey);
      if (url && key) {
        try {
          // createClient을 호출하여 클라이언트를 반환
          return window.supabase.createClient(url, key);
        } catch (e) {
          console.warn('Supabase client 생성 실패:', e.message);
        }
      }
    }
    return null;
  }

  // Storage에 파일 업로드
  function uploadFile(bucket, path, file) {
    var client = sb();
    if (!client) return Promise.reject(new Error('Supabase not initialized'));
    return client.storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: false
    }).then(function(res) {
      if (res.error) throw res.error;
      return client.storage.from(bucket).getPublicUrl(res.data.path);
    }).then(function(ref) {
      return ref.data.publicUrl;
    });
  }

  // ---------- 공지사항 ----------
  var noticeApi = {
    list: function(page, limit) {
      var l = limit || 10;
      var from = ((page || 1) - 1) * l;
      return sb().from('notices')
        .select('id, title, is_pinned, view_count, created_at')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .range(from, from + l - 1);
    },
    get: function(id) {
      return sb().from('notices')
        .select('*')
        .eq('id', id)
        .single()
        .then(function(res) {
          if (res.error) throw res.error;
          return res.data;
        })
        .then(function(notice) {
          return sb().from('notice_files').select('*').eq('notice_id', id)
            .then(function(fr) {
              notice.files = fr.data || [];
              return notice;
            });
        })
        .then(function(notice) {
          return sb().from('notices').update({ view_count: (notice.view_count || 0) + 1 }).eq('id', id)
            .then(function() { return notice; });
        });
    },
    create: function(data, files) {
      return sb().from('notices').insert({
        title: data.title,
        content: data.content,
        is_pinned: data.is_pinned || false
      }).select('id').single()
        .then(function(res) {
          if (res.error) throw res.error;
          return res.data.id;
        })
        .then(function(noticeId) {
          if (!files || files.length === 0) return noticeId;
          var path = noticeId + '/' + Date.now() + '_';
          var uploads = Array.prototype.map.call(files, function(f, i) {
            var p = path + i + '_' + f.name.replace(/[^a-zA-Z0-9._-]/g, '_');
            return uploadFile(BUCKET_NOTICE, p, f).then(function(url) {
              return sb().from('notice_files').insert({
                notice_id: noticeId,
                file_name: f.name,
                file_url: url,
                file_size: f.size
              });
            });
          });
          return Promise.all(uploads).then(function() { return noticeId; });
        });
    },
    update: function(id, data, newFiles) {
      return sb().from('notices').update({
        title: data.title,
        content: data.content,
        is_pinned: data.is_pinned || false
      }).eq('id', id)
        .then(function(res) {
          if (res.error) throw res.error;
          return id;
        })
        .then(function(noticeId) {
          if (!newFiles || newFiles.length === 0) return noticeId;
          var path = noticeId + '/' + Date.now() + '_';
          var uploads = Array.prototype.map.call(newFiles, function(f, i) {
            var p = path + i + '_' + f.name.replace(/[^a-zA-Z0-9._-]/g, '_');
            return uploadFile(BUCKET_NOTICE, p, f).then(function(url) {
              return sb().from('notice_files').insert({
                notice_id: noticeId,
                file_name: f.name,
                file_url: url,
                file_size: f.size
              });
            });
          });
          return Promise.all(uploads).then(function() { return noticeId; });
        });
    },
    delete: function(id) {
      return sb().from('notices').delete().eq('id', id);
    }
  };

  // ---------- 자료실 ----------
  var libraryApi = {
    list: function(page, limit) {
      var l = limit || 10;
      var from = ((page || 1) - 1) * l;
      return sb().from('library')
        .select('id, title, view_count, created_at')
        .order('created_at', { ascending: false })
        .range(from, from + l - 1);
    },
    get: function(id) {
      return sb().from('library')
        .select('*')
        .eq('id', id)
        .single()
        .then(function(res) {
          if (res.error) throw res.error;
          return res.data;
        })
        .then(function(lib) {
          return sb().from('library_files').select('*').eq('library_id', id)
            .then(function(fr) {
              lib.files = fr.data || [];
              return lib;
            });
        })
        .then(function(lib) {
          return sb().from('library').update({ view_count: (lib.view_count || 0) + 1 }).eq('id', id)
            .then(function() { return lib; });
        });
    },
    create: function(data, files) {
      if (!files || files.length === 0) return Promise.reject(new Error('자료실은 첨부파일이 필수입니다.'));
      return sb().from('library').insert({
        title: data.title,
        content: data.content || ''
      }).select('id').single()
        .then(function(res) {
          if (res.error) throw res.error;
          return res.data.id;
        })
        .then(function(libraryId) {
          var path = libraryId + '/' + Date.now() + '_';
          var uploads = Array.prototype.map.call(files, function(f, i) {
            var p = path + i + '_' + f.name.replace(/[^a-zA-Z0-9._-]/g, '_');
            return uploadFile(BUCKET_LIBRARY, p, f).then(function(url) {
              return sb().from('library_files').insert({
                library_id: libraryId,
                file_name: f.name,
                file_url: url,
                file_size: f.size
              });
            });
          });
          return Promise.all(uploads).then(function() { return libraryId; });
        });
    },
    update: function(id, data, newFiles) {
      return sb().from('library').update({
        title: data.title,
        content: data.content || ''
      }).eq('id', id)
        .then(function(res) {
          if (res.error) throw res.error;
          return id;
        })
        .then(function(libraryId) {
          if (!newFiles || newFiles.length === 0) return libraryId;
          var path = libraryId + '/' + Date.now() + '_';
          var uploads = Array.prototype.map.call(newFiles, function(f, i) {
            var p = path + i + '_' + f.name.replace(/[^a-zA-Z0-9._-]/g, '_');
            return uploadFile(BUCKET_LIBRARY, p, f).then(function(url) {
              return sb().from('library_files').insert({
                library_id: libraryId,
                file_name: f.name,
                file_url: url,
                file_size: f.size
              });
            });
          });
          return Promise.all(uploads).then(function() { return libraryId; });
        });
    },
    delete: function(id) {
      return sb().from('library').delete().eq('id', id);
    }
  };

  // ---------- Q&A ----------
  var qnaApi = {
    list: function(page, limit) {
      var l = limit || 10;
      var from = ((page || 1) - 1) * l;
      return sb().from('qna')
        .select('id, title, author_name, view_count, created_at, answer')
        .order('created_at', { ascending: false })
        .range(from, from + l - 1);
    },
    get: function(id) {
      return sb().from('qna')
        .select('*')
        .eq('id', id)
        .single()
        .then(function(res) {
          if (res.error) throw res.error;
          return res.data;
        })
        .then(function(q) {
          return sb().from('qna').update({ view_count: (q.view_count || 0) + 1 }).eq('id', id)
            .then(function() { return q; });
        });
    },
    create: function(data) {
      return sb().from('qna').insert({
        title: data.title,
        content: data.content,
        author_name: data.author_name || '비회원',
        author_email: data.author_email || ''
      }).select('id').single();
    },
    answer: function(id, answer) {
      return sb().from('qna').update({
        answer: answer,
        answered_at: new Date().toISOString(),
        answered_by: '관리자'
      }).eq('id', id);
    }
  };

  global.ABCDX = global.ABCDX || {};
  global.ABCDX.community = {
    notice: noticeApi,
    library: libraryApi,
    qna: qnaApi
  };
})(typeof window !== 'undefined' ? window : this);
