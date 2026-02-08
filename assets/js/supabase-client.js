/**
 * Supabase Client 초기화
 * config.js 또는 window.SUPABASE_CONFIG에서 URL/Key 로드
 * Supabase JS: https://cdn.jsdelivr.net/npm/@supabase/supabase-js
 */
(function(global) {
  function getClient() {
    var config = global.SUPABASE_CONFIG || {};
    var url = config.url || '';
    var key = config.anonKey || '';
    if (!url || !key) return null;
    if (typeof global.supabase !== 'undefined' && global.supabase.createClient) {
      return global.supabase.createClient(url, key);
    }
    return null;
  }
  global.ABCDX = global.ABCDX || {};
  Object.defineProperty(global.ABCDX, 'supabase', {
    get: function() { return this._client || (this._client = getClient()); }
  });
})(typeof window !== 'undefined' ? window : this);
