/**
 * 관리자 - Q&A 목록/답변 - Supabase 연동
 */
$(function() {
  var api = window.ABCDX && window.ABCDX.community && window.ABCDX.community.qna;
  if (!api) return;

  var isListPage = $('.admin-list-table tbody').length;
  var isAnswerPage = $('form.board-form textarea[name="answer"]').length;

  if (isListPage) {
    api.list(1, 50).then(function(res) {
      if (res.error) throw res.error;
      var rows = res.data || [];
      var $tbody = $('.admin-list-table tbody');
      $tbody.empty();
      if (rows.length === 0) {
        $tbody.html('<tr><td colspan="6" style="text-align:center;padding:40px;">등록된 문의가 없습니다.</td></tr>');
        return;
      }
      rows.forEach(function(r, i) {
        var answered = r.answer ? true : false;
        var status = answered ? '<span style="color:var(--accent-green);">답변완료</span>' : '<span style="color:var(--text-warning);">답변대기</span>';
        var action = answered ? '수정' : '답변하기';
        var date = r.created_at ? r.created_at.slice(0, 10).replace(/-/g, '.') : '';
        var url = './admin_qna_answer.html?id=' + r.id;
        $tbody.append(
          '<tr>' +
            '<td>' + (rows.length - i) + '</td>' +
            '<td><a href="' + url + '">' + (r.title || '') + '</a></td>' +
            '<td>' + (r.author_name || '-') + '</td>' +
            '<td>' + date + '</td>' +
            '<td>' + status + '</td>' +
            '<td><a href="' + url + '">' + action + '</a></td>' +
          '</tr>'
        );
      });
    }).catch(function(err) {
      console.error(err);
    });
  }

  if (isAnswerPage) {
    var id = new URLSearchParams(location.search).get('id');
    if (!id) return;
    api.get(id).then(function(q) {
      $('.view-title').text(q.title);
      $('.view-content').html((q.content || '').replace(/\n/g, '<br>'));
      $('.view-meta').html('<span>' + (q.author_name || '비회원') + '</span><span>' + (q.created_at ? q.created_at.slice(0, 10).replace(/-/g, '.') : '') + '</span>');
      var $ta = $('textarea[name="answer"]');
      if (q.answer) $ta.val(q.answer);
    }).catch(function(err) {
      console.error(err);
    });
    $('form.board-form').on('submit', function(e) {
      e.preventDefault();
      var answer = $(this).find('[name="answer"]').val().trim();
      if (!answer) { alert('답변 내용을 입력하세요.'); return; }
      api.answer(id, answer).then(function(res) {
        if (res.error) throw res.error;
        alert('답변이 등록되었습니다.');
        location.href = './admin_qna.html';
      }).catch(function(err) {
        alert('등록 실패: ' + (err.message || err));
      });
    });
  }
});
