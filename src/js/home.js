/**
 * Created by kgd on 27/10/2016.
 */

$(function () {

    init();

    // load total-amout and mobile ratio data from OSS
    $.ajax({
        url: './data.txt',
        success: function (data) {

            var dataFiltered = data.split('\n').filter(isValid);

            function isValid(str) {
                if (str.length > 2) {
                    return str;
                }
            }

            var indexTotal = dataFiltered.indexOf('total_amount');
            var indexMobile = dataFiltered.indexOf('mobile_ratio');

            var arrTotal = dataFiltered.slice(indexTotal + 1, indexMobile);
            var arrMobile = dataFiltered.slice(indexMobile + 1, dataFiltered.length + 1);

            if (!arrTotal) {
                return;
            }

            console.log(arrMobile);

        }
    });

    var $anchors = $('.anchors');
    $anchors.on('click', function (e) {
        e.preventDefault();
        $anchors.removeClass('active');
        $(this).addClass('active');
        $('html,body').animate({scrollTop: $($(this).attr('href')).offset().top}, 500)
    });

    // add title for all pages
    $('.pages .subtitles').html('2016天猫11.11购物狂欢节');


    var typeArr = ['双11剁手进行时','消费新边界','大数据洞察'];  // real types
    // var typeArr = ['消费', '2015', '数据'];  // fake types for dev only
    var numTypes = typeArr.length;
    var articleArr = [];
    for (var i = 0; i < numTypes; i++) {
        articleArr[i] = [];
    }

    // load article info
    $.ajax({
        // url: 'http://www.dtcj.com/web_api/topics/shuang_11_zhuan_ti?max=50',  // real API
        url: '../json/mock_api_data.json',   // test API
        success: function (json) {
            json.data.forEach(function (value, index) {
                for (var j = 0; j < typeArr.length; j++) {
                    if (value['keyword_to_display'].indexOf(typeArr[j]) >= 0) {
                        articleArr[j].push(value);
                    }
                }
            });
            // render articles of all types
            for (var i = 0; i < numTypes; i++) {
                renderArticles(articleArr[i], i);
            }
            function renderArticles(articleArr, index) {
                var numInitial = 4;
                var cardsHtml = '';
                var pageNumber = Number(index + 2);
                // for (var i = 0; i<numInitial; i++) {
                var numArticles = articleArr.length
                for (var i = 0; i < numArticles; i++) {
                    cardsHtml += '<a class="card" target="_self" href="' + articleArr[i].url + '"><div class="card-image" style="background-image: url(' + articleArr[i].thumbnail +
                        ')"><span class="corner-text">' + articleArr[i].keyword_to_display.split('| ')[1] + '</span></div><div class="text-container"><div class="card-text">' +
                        articleArr[i].title + '</div></div></a>'
                }
                // insert articles into pages
                $('#page' + pageNumber + ' .cards-wrapper').append(cardsHtml);
                // hide load-more button if number of articles is not more than initially displayed articles
                if (numArticles <= numInitial) {
                    $('#page' + pageNumber + ' .btn-load-more').addClass('hidden');
                }

                // display default image if no article published
                if (numArticles == 0 && pageNumber == 4) {
                    $('#page' + pageNumber + ' .cards-wrapper').after('' +
                        '<div class="images big-data-inspection"></div>' +
                        '<div class="default-bottom-text">双十一年鉴<br>敬请期待</div>');
                }
            }
        }
    });

    function init() {
        $('.btn-load-more').html('查看更多');
    }

    // load-more-button click event
    $('.btn-load-more').click(function () {
        $(this).addClass('hidden').parent().find('.cards-wrapper').removeClass('cards-collapsed');
    })


    var scrollTriggered = false;
    $(window).scroll( function() {
        if (!scrollTriggered) {
            scrollTriggered = true;

            for (var i=1; i<4; i++) {
                if ($('#page' + i).isVisible(50)) {
                    $anchors.removeClass('active');
                    $('a[href=#page' + i +']').addClass('active');
                }
            }

            setTimeout(function () {
                scrollTriggered = false;
            }, 0.3 * 1000)
        }
    })

    var d = new Date(); // for now
    var datetext = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
    $('#GMV-time').html(datetext);

});

$.fn.isVisible = function (offset) {
    var rect = this[0].getBoundingClientRect();
    return (
        (rect.height > 0 || rect.width > 0) &&
        rect.bottom >= 0 &&
        rect.right >= 0 &&
        rect.top <= (window.innerHeight - offset || document.documentElement.clientHeight - offset) &&
        rect.left <= (window.innerWidth - offset || document.documentElement.clientWidth - offset)
    );
};
