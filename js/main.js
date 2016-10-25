var marvel = {};

marvel.publicKey = '1f4b53f2904d8cd948ee0b22f11a0e79';
marvel.urlEnd = 'http://gateway.marvel.com:80/v1/public/comics';
marvel.urlEndChar = 'http://gateway.marvel.com:80/v1/public/characters';


marvel.getData = function(year, month) {
    var endMonth = parseInt(month);
    var endYear = parseInt(year);
    var d = new Date();
    var currentYear = d.getFullYear();
    var currentMonth = d.getMonth();
    
    if (endYear !== currentYear) {
        if ((endMonth >= 6)) {
            endYear++;
            endMonth -= 5;
        } else {
            endMonth += 5;
        }
    } else {
        if (endMonth >= (currentMonth - 1)) {
            month = 1;
            endMonth = currentMonth;
        } else {
            endMonth = currentMonth;
        }
    }

    endMonth = marvel.formatMonth(endMonth);
    month = marvel.formatMonth(month);

    dateString = `${year}-${month}-01,${endYear}-${endMonth}-01`;
    var yearPlus = year + 1;
    $.ajax({
        url: marvel.urlEnd,
        method: 'GET',
        dataType: 'json',
        data: {
            apikey: marvel.publicKey,
            dateRange: dateString
        }
    }).then(function(theData) {
        var resultsArray = theData.data.results;
        resultsArray = resultsArray.filter(function(issue) {
            return issue.images.length > 0;
        });
        $('main').fadeTo(0, 0);
        resultsArray.forEach(function(individualIssue) {
            let issueTitle = individualIssue.title.replace(/\((.*)\)/, ""),
                imagePath = individualIssue.images[0].path,
                adjust = Math.floor(Math.random() * 40) - Math.floor(Math.random() * 40);
            let $cover = $('<img>')
                .attr({
                    src: imagePath + '.jpg',
                    title: issueTitle,
                    class: 'issue'
                })
                .addClass('tile tooltip')
                .css({
                    "transform": "rotate(" + adjust + "deg) translate3d(0,-10px,0)"
                });
            $('#artwork').append($cover);
        });
        $('main').fadeTo(1000, 1);

        setTimeout(function() {
            $('html, body').animate({
            scrollTop: $(document).height()-$(window).height()
        }, 600);  
        }, 400);
        $('.thor').attr("src", "img/thor.png");
        $('.lightening').addClass('visuallyhidden');
        $('.tooltip').tooltipster({
            theme: 'tooltipster-noir',
        });
    });
};




marvel.setUpKnobs = function() {
    var shadow = "3px 3px 0 #000,-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000";

    $(".year").knob({
        "min": 1961,
        "data-width": 550,
        "max": 2016,
        "fgColor": "rgba(255, 255, 255,.75)",
        "bgColor": "rgba(12,36,44,.65)",
        "skin": "tron",
        "cursor": 70,
        "thickness": .3,
        "angleOffset": 0,
        "inputColor": "#C5CBC8"
    });

    $('.year').css({
        'font-family': 'bangers',
        'text-shadow': shadow
    });

    $(".month").knob({
        "min": 1,
        "data-width": 550,
        "max": 12.9,
        "fgColor": "rgba(196,0,0,.7)",
        "bgColor": "rgba(12,36,44,.65)",
        "skin": "tron",
        "cursor": 70,
        "step": .1,
        "thickness": .3,
        "angleOffset": 0,
        "inputColor": "transparent"
    });
};

marvel.formatMonth = function(month) {
    month = Math.floor(month);
    return (month < 10) ? '0' + month.toString() : month.toString();
}

marvel.imageCounter = 0;

marvel.makeBackground = function(event) {

    let $container = $('.container'),
        $pageControls = $('.pageControls'),
        $hideIt = $('.hideIt'),
        $footer = $('footer'),
        $artwork = $('#artwork');
    $container.addClass('makeReadyForCanvas');
    $pageControls.addClass('visuallyhidden');
    $hideIt.hide();
    $footer.hide();
    $('html,body').animate({ scrollTop: 0 }, 0);
    var img = html2canvas($('body'), {
        useCORS: true,
        background: "#0E202B",
        onrendered: function(canvas) {
            var imageData = canvas.toDataURL();
            marvel.imageCounter ++;
            imageData = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
            var link = $('<a class="hey">').attr('href', imageData).attr('download', `awesome_pic_number ${marvel.imageCounter}`).html(`<img  src="${imageData}"/>`);
            $('.instructions').append(link);
            $('.instructions__gallery').show();
            $container.removeClass('makeReadyForCanvas');
            $pageControls.removeClass('visuallyhidden');
            $hideIt.show();
            $footer.show();
            $artwork.empty();
        }
    });   
}


marvel.init = function() {
    marvel.setUpKnobs();

    let $form = $('form'),
        $thor = $('.thor'),
        $lightening = $('.lightening'),
        $yearBox = $('.yearBox'),
        $monthBox = $('.monthBox'),
        $tooltip_Spiderman = $('.tooltip_Spiderman'),
        $tooltip_hulk = $('.tooltip_hulk'),
        $tooltip_thor = $('.tooltip_thor'),
        $grab = $('.grab'),
        $pageControls = $('.pageControls');

    $form.on('submit', function(e) {
        e.preventDefault();
        var year = $('.year').val();
        var month = $('.month').val();
        var month = marvel.formatMonth(month);
        marvel.getData(year, month);
        $thor.attr("src", "img/thor.gif");
        $lightening.removeClass('visuallyhidden');
    });

    $yearBox.on('mouseenter mouseleave', function(e) {
        $tooltip_Spiderman.tooltipster({
            theme: 'tooltipster-noir',
            animation: 'grow'
        });
        $tooltip_Spiderman.trigger(e.type);
    })

    $monthBox.on('mouseenter mouseleave', function(e) {
        $tooltip_hulk.tooltipster({
            theme: 'tooltipster-noir',
            animation: 'grow'
        });
        $tooltip_hulk.trigger(e.type);
    })

    $tooltip_thor.tooltipster({
        theme: 'tooltipster-noir',
        animation: 'grow'
    });

    $grab.on('click', function(e) {        
         e.preventDefault();
         marvel.makeBackground();
    });

    $form.mousemove(function() {
        var myNumber = Math.floor($('.month').val());
        switch (myNumber) {
            case 1:
                $('.monthText').text('january');
                break;
            case 2:
                $('.monthText').text('february');
                break;
            case 3:
                $('.monthText').text('march');
                break;
            case 4:
                $('.monthText').text('april');
                break;
            case 5:
                $('.monthText').text('may');
                break;
            case 6:
                $('.monthText').text('june');
                break;
            case 7:
                $('.monthText').text('july');
                break;
            case 8:
                $('.monthText').text('august');
                break;
            case 9:
                $('.monthText').text('september');
                break;
            case 10:
                $('.monthText').text('october');
                break;
            case 11:
                $('.monthText').text('november');
                break;
            case 12:
                $('.monthText').text('december');
                break;
        }
    });

        $('a[href*="#"]:not([href="#"])').click(function() {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html, body').animate({
                        scrollTop: target.offset().top
                    }, 600);
                    return false;
                }
            }
        });
    
$(window).scroll(function() {
	var isMobile = window.matchMedia("only screen and (max-width: 760px)");
	if (isMobile.matches) {
      var scrollAmt = 750;
    }else{
       var scrollAmt = 180;
    }
    if ($(this).scrollTop() > scrollAmt) {
        $('.scroll').fadeIn();
    } else if ($(this).scrollTop() < scrollAmt) {
        $('.scroll').fadeOut();
    }
    if ($(this).scrollTop() > 40) {
        $('footer').fadeOut();
    } else if ($(this).scrollTop() < 40) {
        $('footer').fadeIn();
    }
    clearTimeout($.data(this, 'scrollTimer'));
    $.data(this, 'scrollTimer', setTimeout(function() {
        $('.scroll__scrollImage').addClass("visuallyhidden");
        $('.scroll__stillImage').removeClass("visuallyhidden");
    }, 0));
    $('.scroll__scrollImage').removeClass("visuallyhidden");
    $('.scroll__stillImage').addClass("visuallyhidden");


     if($(window).scrollTop() + $(window).height() == $(document).height() && $(window).scrollTop() > 600){
        $('.grab').fadeIn();
     }else{
        $('.grab').fadeOut();
     }
  });



};

$(function() {

    marvel.init();

});
