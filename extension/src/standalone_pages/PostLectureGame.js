// Modified based on muhammadolim.github.io/Find-The-Ball
$(document).ready(() => {
    //////////////////// selectors ////////////////////
    // elements
    let $overlay = $("#overlay");
    let $tapToStart = $("#tap-to-start");
    let $cups = $(".cup .main path");
    
    let $questionPrompt = $("#questionTitle");
    $questionPrompt.hide();

    let $options = $(".answer-option");
    $options.hide();
    
    // initial sizes
    let ballHeight = $("#ball").height();
    let cupTop = $(".cup").offset().top;

    // cups positions
    // let cup1 = $(".cup1").offset().left;
    // let cup2 = $(".cup2").offset().left;
    // let cup3 = $(".cup3").offset().left;

    // time for levels
    // lower number => faster shuffle speed
    let time = 50;

    //////////////////// events ////////////////////

    // click on overlay (tap to start)
    $overlay.click(() => {

        // hide buttons
        $overlay.hide();
        $tapToStart.hide();

        // disable to click on cups
        $(".cup").addClass("avoid-clicks");

        // cups up
        $cups.css({
            "transition": `${time + 100}ms`,
            "transform": `translateY(-${100 - ballHeight}px)`
        });

        // cups down
        setTimeout(() => {
            $cups.css("transform", "translateY(100px)");
        }, time * 5);

        // start shuffle
        setTimeout(() => {

            // shuffle counter
            let i = 0;

            let shuffle = setInterval(() => {

                // shuffle counter +1
                i++;

                // two random cups to shuffle
                let rand1 = Math.floor(Math.random() * 3 + 1);
                let rand2 = Math.floor(Math.random() * 3 + 1);

                while (rand1 == rand2) {
                    rand2 = Math.floor(Math.random() * 3 + 1);
                }

                // half distance between two cups
                let distance = ($(`.cup${rand1}`).offset().left - $(`.cup${rand2}`).offset().left) / 2;

                // change position of first cup like this /\
                $(`.cup${rand1}`).animate({
                    left: $(`.cup${rand2}`).offset().left + distance,
                    top: `${cupTop + 50}`
                }, time, "linear").animate({
                    left: $(`.cup${rand2}`).offset().left,
                    top: `${cupTop}`
                }, time, "linear");

                // change position of second cup like this \/
                $(`.cup${rand2}`).animate({
                    left: $(`.cup${rand1}`).offset().left - distance,
                    top: `${cupTop - 50}`
                }, time, "linear").animate({
                    left: $(`.cup${rand1}`).offset().left,
                    top: `${cupTop}`
                }, time, "linear");

                // if shuffle counter reachs to 15 stop shuffling
                if (i == 15) {
                    clearInterval(shuffle);

                    // enable to click on cups
                    $(".cup").removeClass("avoid-clicks");

                    // Show the question prompt and options
                    $questionPrompt.text("Here is a hint");
                    $questionPrompt.show();
                    $options.show();
                }

            }, time * 2 + 50);

        }, time * 7);
    });

    // click on cups
    $(".cup").click((e) => {
        // disable to click on cups
        $(".cup").addClass("avoid-clicks");

        // options.up
        $options.css({
            "transform": "translateY(-100px)"
        });

        // cups up
        $cups.css({
            "transform": `translateY(-${100 - ballHeight}px)`
        });
        
        let correct = null;
        // if ball found
        if ($(e.currentTarget).hasClass("cup2")) {
            $(this).find(".o").show();
            correct = true;
        } else {
            // if ball not found
            $(this).find(".x").show();
            correct = false;
        }

        window.parent.postMessage({ correct }, "*");
    });
});
