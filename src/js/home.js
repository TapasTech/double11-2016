/**
 * Created by kgd on 27/10/2016.
 */

$(function () {

    init();

    function init() {

        // load GMV and mobile-ratio data
        loadDynamicData();

        animateProgressBar(1);

        registerEvents();

        loadEventImages();

        loadArticleData();
    }

    function loadEventImages() {
        // load data-trend, national and global data images
        // trend data image
        $('<img/>').attr('src', 'images/data-trend.png').load(function() {
            $(this).remove(); // prevent memory leaks
            $('#divDataTrend').append('<div class="image-title"><h4 class="subtitles">2016天猫11.11购物狂欢节</h4>' +
                '<h3 class="description">总成交额趋势</h3></div><img src="images/data-trend.png"/>');
        }).error(function() {
            $('#divDataTrend').append('<div id="data-trend-default"><div class="images data-trend-default"></div><div class="text-under-image">更多数据敬请期待...</div></div>');
        });

        // global data image
        $('<img/>').attr('src', 'images/global-data-test.png').load(function() {
            $(this).remove(); // prevent memory leaks
            $('#divGlobalData').append('<div class="image-title"><h4 class="subtitles">2016天猫11.11购物狂欢节</h4><h3 class="description">' +
                '全球交易国家/地区排行</h3></div><div class="images"><img src="images/global-data-test.png"></div>');
        });

        // national data image
        $('<img/>').attr('src', 'images/national-data-test.png').load(function() {
            $(this).remove(); // prevent memory leaks
            $('#divNationalData').append('<div class="image-title"><h4 class="subtitles">2016天猫11.11购物狂欢节</h4><h3 class="description">' +
                '全天交易额省份TOP10</h3></div><div class="images"><img src="images/national-data-test.png"/></div>');
        });
    }

    var dataArray = [];

    function loadDynamicData() {
        // load total-amout and mobile ratio data from OSS
        /*$.ajax({
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

                /!*for (var i = 0; i<arrMobile.length; i++) {

                }*!/

                if (!arrTotal) {
                    return;
                }
                console.log(arrMobile);
            }
        });*/

        $.ajax({
            url: "./json/mock_api_data.json",
            success: function(json) {
                var dataArray = json.data;

                for(var i=0; i<dataArray.length; i++) {

                    // generate shiny point
                    generatePoint(dataArray[i].time);

                }

                animateClock(dataArray[1].GMV, dataArray[1].time);

                $('.shiny-point').on('mouseenter', function() {
                    $('.shiny-point').removeClass('active');
                    $(this).addClass('active');
                })

            }
        });

        function generatePoint(time) {

        }

        // update GMV data
        var $gmvTime = $('#GMV-time');
        var $gvmNumber = $('#GMV-number');
       /* var number = 582;
        var latestTime = "2016-11-11 9:35:20";

        animateClock(number, latestTime);*/

        function animateClock(number, time) {

            var timeAnimation = 1 * 1000;
            var numTimeSteps = 25;
            var numIntervals = parseInt(timeAnimation / numTimeSteps);

            var counter = 0;
            var interval = setInterval(function() {
                $gmvTime.html(formateDate(new Date(time)));
                counter++;
                $gvmNumber.html( ( number * counter/numTimeSteps ).toFixed(0) );
            }, numIntervals);

            setTimeout(function() {
                clearInterval(interval);
                $gvmNumber.html( number);
            }, timeAnimation);
        }


        function formateDate(date) {
            var hours = prependZero(date.getHours());
            var minutes = prependZero(date.getMinutes());
            var seconds = prependZero(date.getSeconds());
            return hours + ":" + minutes + ":" + seconds;
        }
        function prependZero(value) {
            return (value < 10) ? "0" + value : value;
        }
    }

    function registerEvents() {
        var $anchors = $('.anchors');
        $anchors.on('click', function (e) {
            e.preventDefault();
            $anchors.removeClass('active');
            $(this).addClass('active');
            $('html,body').animate({scrollTop: $($(this).attr('href')).offset().top}, 500)
        });

        $('#navMobileMenu').on('click', function() {
            $('.nav-mobile-header').toggleClass('black-bg');
            $('#toggleMenu').slideToggle('fast');
        });
        $('.list-items').on('click', function() {
            $('#navMobileMenu').click();
        });

        // load-more-button click event
        $('.btn-load-more').click(function () {
            $(this).addClass('hidden').parent().find('.cards-wrapper').removeClass('cards-collapsed');
        })

        // scroll synchronize navigation bar
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
        });
    }

    function animateProgressBar(ratio) {
        // var fullPercentage = 0.74;
        var fullPercentage = 0.74;
        $('#progressBar').circleProgress({
            value: ratio * fullPercentage,
            size: 194,
            startAngle: -Math.PI * 1.24,
            fill: {
                gradient: ["rgba(255,87,51,0.3)", "rgba(255,87,51,0.7)"]
            },
            emptyFill: "rgba(255,255,255,0)",
            thickness: 24,
            animation: { duration: 1200}
        });
    }

    function loadArticleData() {
        var typeArr = ['双11剁手进行时','消费新边界','大数据洞察'];  // real types
        // var typeArr = ['消费', '2015', '数据'];  // fake types for dev only
        var numTypes = typeArr.length;
        var articleArr = [];
        for (var i = 0; i < numTypes; i++) {
            articleArr[i] = [];
        }
        // load article info
        $.ajax({
            url: 'http://www.dtcj.com/web_api/topics/shuang_11_zhuan_ti?max=50',  // real API
            // url: '../json/mock_api_articles.json',   // test API
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
                    var $cardsWrapper = $('#page' + pageNumber + ' .cards-wrapper');
                    $cardsWrapper.append(cardsHtml);
                    // hide load-more button if number of articles is not more than initially displayed articles
                    if (numArticles <= numInitial) {
                        $('#page' + pageNumber + ' .btn-load-more').addClass('hidden');
                    }

                    // display default image if no article published
                    if (numArticles == 0 && pageNumber == 4) {
                        $cardsWrapper.after('' +'<div class="images"><img class="img-last-page" src="images/big-data-inspection.png"></div>' +
                            // '<div class="images big-data-inspection"></div>' +
                            '<div class="default-bottom-text">双十一年鉴<br>敬请期待</div>');
                    }
                }
            }
        });
    }

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
