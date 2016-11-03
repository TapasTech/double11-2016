/**
 * Created by kgd on 27/10/2016.
 */

$(function () {

    var env = 'prod';

    var CLOCK_POINT_WIDTH = 24;
    var timeStamp = new Date().getTime();
    init();

    function init() {
        // load GMV and mobile-ratio data
        loadDynamicData();
        // register DOM events
        registerEvents();
        // load images for page 2-4
        loadEventImages();
        // load article API
        loadArticleData();
    }

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

        var dataUrl;
        if (env == 'dev') {
            dataUrl = "./data-test.json";
        } else {
            dataUrl = "./data.json";
        }
        $.ajax({
            url: dataUrl + ("?timestapm=" + timeStamp),
            success: function(json) {
                if (!json) {
                    return;
                }

                var dataArray = json.data;
                var dataArrLength = dataArray.length;
                if (dataArrLength <= 0) {
                    return;
                }
                var graduationHtml = '';
                for(var i=0; i<dataArrLength; i++) {
                    graduationHtml += generatePoint(dataArray[i]);
                }

                $('#graduationWrapper').append(graduationHtml);

                // delay first animation
                setTimeout( function() {
                    animateClock(dataArray[dataArrLength-1].GMV, dataArray[dataArrLength-1].time, dataArray[dataArrLength-1].mobile_ratio);
                }, 0.8 * 1000);

                $('.shiny-point').on('mouseenter', function() {
                    $('.shiny-point').removeClass('active');
                    var $this = $(this);
                    $this.addClass('active');
                    animateClock($this.attr('data-gmv'), $this.attr('data-time'), $this.attr('data-mobile-ratio'));
                });

                function calcHour(time) {
                    return time.getHours() + time.getMinutes()/60;
                }

                function generatePoint(data) {
                    var clockRadius = 136;   // px, assuming clock size is fixed
                    var angle = calcHour(new Date(data.time)) / 24 * ( 2 * Math.PI);
                    var trans = [
                        parseInt(clockRadius * Math.sin(angle)),
                        parseInt(-clockRadius * Math.cos(angle)),
                    ];
                    trans = trans.map(function (point) {
                        return (point - CLOCK_POINT_WIDTH / 2) + 'px';
                    });
                    return '<div class="shiny-point" data-time="' + data.time + '" data-gmv="' + data.GMV +
                        '" data-mobile-ratio="' + data.mobile_ratio + '" style="transform:translate(' + trans[0] + ',' + trans[1] + ')" ></div>';
                }
            }
        });

        // update GMV data
        var $gmvTime = $('#GMV-time');
        var $gaugeTime = $('#gaugeTime');
        var $gvmNumber = $('#GMV-number');
        var $mobileRatio = $('#mobileRatio');

        function animateClock(number, time, mobileRatio) {
            animateProgressBar(mobileRatio);
            mobileRatio *= 100;
            var timeAnimation = 1000;  //ms
            var numTimeSteps = 25;  // number of time steps during animation period
            var numIntervals = parseInt(timeAnimation / numTimeSteps);  // time span of each time step
            var counter = 0;
            var interval = setInterval(function() {
                $gmvTime.html(formateDate(new Date(time)));
                $gaugeTime.html(formateDate(new Date(time)));
                counter++;
                $gvmNumber.html( ( number * counter/numTimeSteps ).toFixed(0) );
                $mobileRatio.html( (mobileRatio * counter/numTimeSteps).toFixed(0) );
            }, numIntervals);
            setTimeout(function() {
                clearInterval(interval);
                $gvmNumber.html(number);
                $mobileRatio.html(mobileRatio.toFixed(0));
            }, timeAnimation);
        }

        function animateProgressBar(ratio) {
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

        function formateDate(date) {
            var hours = prependZero(date.getHours());
            var minutes = prependZero(date.getMinutes());
            var seconds = prependZero(date.getSeconds());
            return hours + ":" + minutes + ":" + seconds;

            function prependZero(value) {
                return (value < 10) ? "0" + value : value;
            }
        }
    }

    function registerEvents() {
        var $anchors = $('.anchors');
        $anchors.on('click', function (e) {
            e.preventDefault();
            $anchors.removeClass('active');
            $(this).addClass('active');
            $('html,body').animate({scrollTop: $($(this).attr('href')).offset().top}, 500);
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
            var $cardsWrapper = $(this).addClass('hidden').parent().find('.cards-wrapper');
            $cardsWrapper.removeClass('cards-collapsed');
            $('.card-image img').each(function () {
                $(this).attr('src', $(this).attr('data-image'));
            });
        });

        // scroll synchronize navigation bar
        var scrollTriggered = false;
        var lastScrollY;
        var currentScrollY;
        var offset = 150;
        $(window).scroll( function() {
            if (!scrollTriggered) {
                lastScrollY = window.scrollY;
                scrollTriggered = true;
                setTimeout(function () {
                    currentScrollY = window.scrollY;
                    if (currentScrollY > lastScrollY) {  // scrolling down
                        for (var i=1; i<=4; i++) {
                            if ($('#page' + i).isVisible(offset)) {
                                $anchors.removeClass('active');
                                $('a[href=#page' + i +']').addClass('active');
                            }
                        }
                    } else {  // scrolling up
                        for (var j=4; j>0; j--) {
                            if ($('#page' + j).isVisible(offset)) {
                                $anchors.removeClass('active');
                                $('a[href=#page' + j +']').addClass('active');
                            }
                        }
                    }
                    scrollTriggered = false;
                }, 0.3 * 1000);
            }
        });
    }

    function loadEventImages() {
        // load images (from image1.png to image5.png)
        for (var i = 1; i <= 5; i++) {
            $('<img/>').attr('src', 'images/image' + i + '.png').load(function (i) {
                $(this).remove(); // prevent memory leaks
                $('#remoteImageWrapper').append('<div class="images">' + i.target.outerHTML + '</div>');
            });
        }
        if ($('#remoteImageWrapper .images').length == 0) {
            $('#remoteImageWrapper').append('<div class="images"><img class="img-default" src="images/data-trend-default.png"></div>' +
                '<div class="text-under-image">更多数据敬请期待...</div>');
        }
    }

    function loadArticleData() {
        var typeArr = ['双11剁手进行时','消费新边界','大数据洞察'];
        var numTypes = typeArr.length;
        var articleArr = [];
        for (var i = 0; i < numTypes; i++) {
            articleArr[i] = [];
        }
        // load article info
        var articleApiUrl;
        if (env=='dev') {
            articleApiUrl = '../json/mock_api_articles.json';
        } else {
            articleApiUrl = 'http://www.dtcj.com/web_api/topics/shuang_11_zhuan_ti?max=50';
        }
        $.ajax({
            url: articleApiUrl + "?time=" + timeStamp,
            success: function (json) {
                json.data.forEach(function (value, index) {
                    for (var j = 0; j < typeArr.length; j++) {
                        if (value.keyword_to_display.indexOf(typeArr[j]) >= 0) {
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
                    var numArticles = articleArr.length;
                    var json;
                    for (var i = 0; i < numArticles; i++) {
                        json = articleArr[i];
                        cardsHtml += '<a class="card" target="_self" href="' + json.url + '"><div class="card-image"' +
                            '"><img ';
                        if (i<numInitial) {
                            cardsHtml += 'src="' + json.thumbnail + '"';
                        }
                        cardsHtml += ' data-image="' + json.thumbnail +'"><span class="corner-text">' + json.keyword_to_display.split('| ')[1] + '</span></div><div class="text-container"><div class="card-text">' +
                            json.title + '</div></div></a>';
                    }
                    // insert articles into pages
                    var $cardsWrapper = $('#page' + pageNumber + ' .cards-wrapper');
                    $cardsWrapper.append(cardsHtml);
                    // hide load-more button if number of articles is not more than initially displayed articles
                    if (numArticles <= numInitial) {
                        $('#page' + pageNumber + ' .btn-load-more').addClass('hidden');
                    }
                    // display default image if no article published (on page 4 only)
                    if (numArticles === 0 && pageNumber === 4) {
                        $cardsWrapper.after('' +'<div class="images"><img class="img-last-page" src="images/big-data-inspection.png"></div>' +
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
