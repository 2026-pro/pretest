/**
 * 관리자 - 자료실 작성 - Supabase 연동
 */
$(function() {
  var api = window.ABCDX && window.ABCDX.community && window.ABCDX.community.library;
  if (!api) return;

  var quill = window.quillEditor;
  $('form.board-form').on('submit', function(e) {
    e.preventDefault();
    var $form = $(this);
    var title = $form.find('[name="title"]').val().trim();
    var content = quill ? quill.root.innerHTML : $form.find('#content-input').val() || '';
    var fileInputs = $form.find('input[type="file"]');
    var files = [];
    fileInputs.each(function() {
      var f = this.files[0];
      if (f) files.push(f);
    });
    if (!title) { alert('제목을 입력하세요.'); return; }
    if (files.length === 0) { alert('첨부파일을 선택하세요.'); return; }
    api.create({ title: title, content: content }, files).then(function(id) {
      alert('등록되었습니다.');
      location.href = './community_library_view.html?id=' + id;
    }).catch(function(err) {
      alert('등록 실패: ' + (err.message || err));
    });
  });
});
