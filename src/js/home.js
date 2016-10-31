/**
 * Created by kgd on 27/10/2016.
 */

$(function() {

    init();

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
    });

    var $anchors = $('.anchors');
    $anchors.on('click', function(e) {
        e.preventDefault();
        $anchors.removeClass('active');
        $(this).addClass('active');
        $('html,body').animate({scrollTop: $($(this).attr('href')).offset().top}, 500)
    });

    // add title for all pages
    $('.pages .subtitles').html('2016天猫11.11购物狂欢节');



    // var typeArr = ['跟踪报道','DT消费新边界智库','大数据洞察'];  // real types
    var typeArr = ['消费','2015','数据'];  // fake types for dev only
    var numTypes = typeArr.length;
    var articleArr = [];
    for (var i = 0; i<numTypes; i++) {
        articleArr[i] = [];
    }

    // load article info
    $.ajax({
        url: 'http://www.dtcj.com/web_api/topics/shuang_11_zhuan_ti?max=50',
        success: function(json) {
            console.log(json);

            json.data.forEach(function(value, index) {
                for (var j = 0; j<typeArr.length; j++) {
                    if (value['keyword_to_display'].indexOf(typeArr[j]) >= 0) {

                        articleArr[j].push(value);

                    }
                }

            });
            for (var i = 0; i<numTypes; i++) {
                renderArticles(articleArr[i], i);
            }


            function renderArticles(articleArr, index){
                var numInitial = 4;
                var cardsHtml ='';
                for (var i = 0; i<numInitial; i++) {
                    if ( i < articleArr.length) {
                        cardsHtml += '<a class="card" target="_blank" href="'+ articleArr[i].url + '"><div class="card-image" style="background-image: url(' + articleArr[i].thumbnail +
                            ')"><span class="corner-text">' + articleArr[i].keyword_to_display+ '</span></div><div class="text-container"><div class="card-text">' +
                            articleArr[i].title +'</div></div></a>'
                    }
                    else {
                        break;
                    }
                }
                // insert articles into pages
                $('#page' + Number(index+2) +' .cards-wrapper').append(cardsHtml)
            }

        }
    });

    function init() {
        $('.btn-load-more').html('加载更多');
    }

});

