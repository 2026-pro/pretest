/**
 * Supabase 헬퍼 함수 모음
 */

// Supabase 인스턴스 참조 (var로 선언하여 중복 방지)
var supabase = window.supabaseInstance;

// 1. 데이터 조회 (특정 테이블)
async function getRecords(tableName, options = {}) {
  try {
    let query = supabase.from(tableName).select(options.columns || '*');
    
    // 필터 적용
    if (options.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    
    // 정렬
    if (options.orderBy) {
      query = query.order(options.orderBy.column, { 
        ascending: options.orderBy.ascending !== false 
      });
    }
    
    // 페이지네이션
    if (options.page && options.pageSize) {
      const start = (options.page - 1) * options.pageSize;
      query = query.range(start, start + options.pageSize - 1);
    }
    
    const { data, error, count } = await query;
    if (error) throw error;
    
    return { data, count, success: true };
  } catch (error) {
    console.error(`Error fetching ${tableName}:`, error);
    return { data: [], count: 0, success: false, error: error.message };
  }
}

// 2. 단일 레코드 조회
async function getRecord(tableName, id) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { data, success: true };
  } catch (error) {
    console.error(`Error fetching record:`, error);
    return { data: null, success: false, error: error.message };
  }
}

// 3. 데이터 삽입
async function createRecord(tableName, payload) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .insert([payload])
      .select('*')
      .single();
    
    if (error) throw error;
    return { data, success: true };
  } catch (error) {
    console.error(`Error creating record:`, error);
    return { data: null, success: false, error: error.message };
  }
}

// 4. 데이터 업데이트
async function updateRecord(tableName, id, updates) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) throw error;
    return { data, success: true };
  } catch (error) {
    console.error(`Error updating record:`, error);
    return { data: null, success: false, error: error.message };
  }
}

// 5. 데이터 삭제
async function deleteRecord(tableName, id) {
  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error(`Error deleting record:`, error);
    return { success: false, error: error.message };
  }
}

// 6. 파일 업로드
async function uploadFile(bucketName, filePath, file) {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    return { data, success: true };
  } catch (error) {
    console.error(`Error uploading file:`, error);
    return { data: null, success: false, error: error.message };
  }
}

// 7. 파일 다운로드 URL 생성
function getFileUrl(bucketName, filePath) {
  try {
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    return data?.publicUrl || null;
  } catch (error) {
    console.error(`Error getting file URL:`, error);
    return null;
  }
}

// 8. 파일 삭제
async function deleteFile(bucketName, filePath) {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error(`Error deleting file:`, error);
    return { success: false, error: error.message };
  }
}

// 9. 실시간 구독 (웹소켓)
function subscribeToChanges(tableName, event, callback) {
  return supabase
    .channel(`${tableName}_changes`)
    .on(
      'postgres_changes',
      {
        event: event,
        schema: 'public',
        table: tableName
      },
      callback
    )
    .subscribe();
}
