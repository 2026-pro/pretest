/**
 * 공지사항 목록/상세 페이지 - Supabase 연동
 */
$(function() {
  var api = window.ABCDX && window.ABCDX.community && window.ABCDX.community.notice;
  if (!api) return;

  var isListPage = $('.board-list').length;
  var isViewPage = $('.board-view').length;

  if (isListPage) {
    var page = 1;
    var limit = 10;
    api.list(page, limit).then(function(res) {
      if (res.error) throw res.error;
      var rows = res.data || [];
      var $list = $('.board-list');
      $list.empty();
      if (rows.length === 0) {
        $list.append('<li class="board-item"><span style="display:block;padding:40px;text-align:center;color:var(--text-color-p2);">등록된 공지사항이 없습니다.</span></li>');
        return;
      }
      rows.forEach(function(r, i) {
        var num = r.is_pinned ? '공지' : (rows.length - i);
        var numClass = r.is_pinned ? 'num notice' : 'num';
        var date = r.created_at ? r.created_at.slice(0, 10).replace(/-/g, '.') : '';
        var url = './community_notice_view.html?id=' + r.id;
        var html = '<li class="board-item"><a href="' + url + '">' +
          '<span class="' + numClass + '">' + num + '</span>' +
          '<span class="title">' + (r.title || '') + '</span>' +
          '<span class="date">' + date + '</span>' +
          '<span class="hit">' + (r.view_count || 0) + '</span></a></li>';
        $list.append(html);
      });
    }).catch(function(err) {
      console.error(err);
    });
  }

  if (isViewPage) {
    var id = new URLSearchParams(location.search).get('id');
    if (!id) return;
    api.get(id).then(function(notice) {
      $('.view-title').text(notice.title);
      $('.view-content').html(notice.content || '');
      var meta = (notice.created_at ? notice.created_at.slice(0, 10).replace(/-/g, '.') : '') + ' | 조회 ' + (notice.view_count || 0);
      $('.view-meta').html('<span>관리자</span><span>' + meta + '</span>');
      var $files = $('.view-files');
      if (notice.files && notice.files.length) {
        var html = '<h4>첨부파일</h4>';
        notice.files.forEach(function(f) {
          html += '<a href="' + f.file_url + '" target="_blank" rel="noopener"><span>📎</span> ' + f.file_name + '</a>';
        });
        $files.html(html).show();
      } else {
        $files.hide();
      }
    }).catch(function(err) {
      console.error(err);
    });
  }
});
