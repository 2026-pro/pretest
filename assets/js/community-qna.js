/**
 * Q&A 목록/상세/글쓰기 페이지 - Supabase 연동
 */
$(function() {
  var api = window.ABCDX && window.ABCDX.community && window.ABCDX.community.qna;
  if (!api) return;

  var isListPage = $('.board-list').length;
  var isViewPage = $('.board-view').length;
  var isWritePage = $('form.board-form').length && window.location.pathname.indexOf('qna_write') > -1;

  if (isListPage) {
    api.list(1, 10).then(function(res) {
      if (res.error) throw res.error;
      var rows = res.data || [];
      var $list = $('.board-list');
      $list.empty();
      if (rows.length === 0) {
        $list.html('<li class="board-item"><span style="display:block;padding:40px;text-align:center;color:var(--text-color-p2);">등록된 문의가 없습니다.</span></li>');
        return;
      }
      rows.forEach(function(r, i) {
        var num = rows.length - i;
        var date = r.created_at ? r.created_at.slice(0, 10).replace(/-/g, '.') : '';
        var url = './community_qna_view.html?id=' + r.id;
        $list.append(
          '<li class="board-item">' +
            '<a href="' + url + '">' +
              '<span class="num">' + num + '</span>' +
              '<span class="title">' + (r.title || '') + '</span>' +
              '<span class="date">' + date + '</span>' +
              '<span class="hit">' + (r.view_count || 0) + '</span>' +
            '</a>' +
          '</li>'
        );
      });
    }).catch(function(err) {
      console.error(err);
    });
  }

  if (isViewPage) {
    var id = new URLSearchParams(location.search).get('id');
    if (!id) return;
    api.get(id).then(function(q) {
      $('.view-title').text(q.title);
      $('.view-content').html((q.content || '').replace(/\n/g, '<br>'));
      var meta = (q.author_name || '비회원') + ' | ' + (q.created_at ? q.created_at.slice(0, 10).replace(/-/g, '.') : '') + ' | 조회 ' + (q.view_count || 0);
      $('.view-meta').html('<span>' + meta + '</span>');
      var $ans = $('.answer-box');
      if (q.answer) {
        $ans.find('.answer-content').html((q.answer || '').replace(/\n/g, '<br>')).end().show();
      } else {
        $ans.hide();
      }
    }).catch(function(err) {
      console.error(err);
    });
  }

  if (isWritePage) {
    $('form.board-form').on('submit', function(e) {
      e.preventDefault();
      var $form = $(this);
      var title = $form.find('[name="title"]').val().trim();
      var content = $form.find('[name="content"]').val().trim();
      if (!title) { alert('제목을 입력하세요.'); return; }
      if (!content) { alert('내용을 입력하세요.'); return; }
      api.create({ title: title, content: content }).then(function(res) {
        if (res.error) throw res.error;
        alert('문의가 등록되었습니다.');
        location.href = './community_qna.html';
      }).catch(function(err) {
        alert('등록 실패: ' + (err.message || err));
      });
    });
  }
});
