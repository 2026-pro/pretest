const form = {
    init(){
        this.file();
        this.password();
        this.member_add();
        this.booth_form.init();
    },
    file(){
        // 파일 선택 시 파일명 표시
        $('.input-file input').change(function(){
            const nameElement = $(this).parent().find('.file-name');
            const file = $(this).val();
            if(file){
                nameElement.removeClass('empty');
                nameElement.text(file);
            }else{
                nameElement.addClass('empty');
                nameElement.text('파일을 등록하세요');
            }
        });
    },
    password(){
        // 비밀번호 보기 버튼 클릭 시 비밀번호 보기 여부 토글
        $('.btn-show').click(function(){
            $(this).toggleClass('active');
            $(this).parent().find('input').attr('type', $(this).hasClass('active') ? 'text' : 'password');
        });
    },
    member_add(){
        // 단체 참가자 등록 버튼 클릭 시 단체 참가자 등록 행 추가
        $('.btn-member-add').click(function(){
            const $row_group = $('.row-group.member').clone();
            $row_group.find('input').val('');
            $(this).before($row_group);
        });
    },
    booth_form:{
        // 부스 신청 폼 초기화
        booth_total:0,
        sale_total:0,
        total_price:0,
        vat:0,
        init(){
            this.booth_count();
            this.sale_count();
        },
        booth_count(){
            const $root = $('.booth-list');
            $root.on('input change', '.booth-count', function(){
                const count = parseInt($(this).val(), 10) || 0;
                const price = parseInt($(this).data('price'), 10) || 0;

                if(count > 0){
                    $(this).addClass('has-value');
                }else{
                    $(this).removeClass('has-value');
                }

                $(this).closest('.booth-item').find('.booth-price').val((count * price).toLocaleString());

                // 총합 갱신
                let totalCount = 0;
                let totalPrice = 0;
                $root.find('.booth-count').each(function(){
                    const c = parseInt($(this).val(), 10) || 0;
                    const p = parseInt($(this).data('price'), 10) || 0;
                    totalCount += c;
                    totalPrice += c * p;
                });
                $('#booth-count').text(totalCount);
                $('#booth-total, #booth-price').text(totalPrice.toLocaleString());
                form.booth_form.booth_total = totalPrice;
                form.booth_form.cal();
            });
            
        },
        sale_count(){
            const $root = $('.sale-wrap');
            let totalSaleCount = 0;
            let totalSalePrice = 0;
            $root.on('change', '.sale-item-header input[type="checkbox"]', function(index,item){
                const price = $(this).data('price');

                if($(this).is(':checked')){
                    totalSaleCount += 1;
                    totalSalePrice += price;
                }else{
                    totalSaleCount -= 1;
                    totalSalePrice -= price;
                }

                $('#sale-total').text(totalSalePrice.toLocaleString());
                $('.sale-total').text('-'+totalSalePrice.toLocaleString());
                form.booth_form.sale_total = totalSalePrice;
                form.booth_form.cal();    
            });
            
        },
        cal(){
            const price = this.booth_total - this.sale_total;
            this.vat = (price > 0) ? price * 0.1 : 0;
            this.total_price = (price > 0) ? price + this.vat : 0;
            $('#vat').text(this.vat.toLocaleString());
            $('#total-price').text(this.total_price.toLocaleString());
        },
    }
}
$(function(){
    form.init();
});