let flag = false;

$(".play-btn").on("click", function () {
    flag = true;
    $("#welcome").css('display', 'none');
    $("#examing").css('display', 'block');
    t = setInterval("CountDown()", 1000);
    CountDown()
    goPlay()

});

// 暂停和恢复
$("#suspend-time").on("click", function () {
    $(".black").css('display', 'block');
    $(".goOn").css('display', 'block');
    document.getElementById("suspend-time").innerHTML = '►';
    clearInterval(t);
});
$('.goonbtn').on('click', function () {
    $(".black").css('display', 'none');
    $(".goOn").css('display', 'none');
    document.getElementById("suspend-time").innerHTML = '||';
    t = setInterval('CountDown()', 1000);
});

// 30分钟
var maxtime = 60 * 60 * 2 + 16 * 60;
//定时器
var t;

function CountDown() {
    if (maxtime >= 0) {
        let hour = parseInt(maxtime / 60 / 60) % 60;
        let minite = parseInt(maxtime / 60) % 60;
        let seconds = parseInt(maxtime % 60);
        msg = `${hour}:${minite < 10 ? '0' + minite : minite}:${seconds < 10 ? '0' + seconds : seconds}`
        document.getElementById("timer").innerHTML = msg;

        maxtime--;

        if (maxtime === 5 * 60) {
            $(".timinfo").css("display", "block");
            initializeClock(10)
        }
        if (maxtime === 8000) {
            $(".t100").css('display', 'block');
            setTimeout(function () {
                $(".t100").css('display', 'none');
            }, 2000)
        }
        if (maxtime === 7850) {
            $(".t300").css('display', 'block');
            setTimeout(function () {
                $(".t300").css('display', 'none');
            }, 2000)
        }
    } else {
        clearInterval(t);
        alert("时间到，结束!");
        // 计时结束自动结算，逻辑放在两个文件了，不想做了。。。
    }
}

// 提醒倒计时，显示10秒
function initializeClock(endtime) {
    const timeinterval = setInterval(() => {
        if (endtime <= 0) {
            clearInterval(timeinterval);
            $(".timinfo").css("display", "none");
        }
        endtime--;
    }, 1000);
}

// 鼠标经过显示图片
$('.play-btn').ready(function () {
    $(".play-btn").mouseenter(function () {
        $(".btn-img").css("display", "block");
    });
    $(".play-btn").mouseleave(function () {
        $(".btn-img").css("display", "none");
    });
});

// 监听刷新事件
document.addEventListener("DOMContentLoaded", function () {
    window.addEventListener("beforeunload", function (event) {
        if (flag) {
            event.returnValue = "gohome";
        }
    })
})

$('#gohomebtn').click(function () {
    if (window.confirm("页面内容将丢失，确认继续吗")) {
        flag = false;
        window.location.reload();
    }
})

