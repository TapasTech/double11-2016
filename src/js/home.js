/**
 * Created by kgd on 27/10/2016.
 */

$(function() {

    // load total-amout and mobile ratio data from OSS
    $.ajax({
        url: './data.txt',
        success: function(data) {

            var dataFiltered = data.split('\n').filter(isValid);
            function isValid(str) {
                if (str.length > 2) {
                    return str;
                }
            }

            var indexTotal = dataFiltered.indexOf('total_amount');
            var indexMobile = dataFiltered.indexOf('mobile_ratio');

            var arrTotal = dataFiltered.slice(indexTotal+1, indexMobile);
            var arrMobile = dataFiltered.slice(indexMobile+1, dataFiltered.length+1);

            if (!arrTotal) {
                return;
            }

            console.log(arrMobile);

        }
    })

    var $anchors = $('.anchors');
    $anchors.on('click', function(e) {
        e.preventDefault();
        $anchors.removeClass('active');
        $(this).addClass('active');
        $('html,body').animate({scrollTop: $($(this).attr('href')).offset().top}, 500)
    });

    // add title for all pages
    $('.pages .subtitles').html('2016天猫11.11购物狂欢节');


    // load article info
    $.ajax({
        url: 'http://www.dtcj.com/web_api/topics/shuang_11_zhuan_ti?max=50',
        success: function(json) {
            console.log(json);
            json.data.forEach(function(value, index) {
                if (value.keyword_to_display.indexOf('零食') >= 0) {
                    console.log(value,index);
                }
            });

        }
    })


});