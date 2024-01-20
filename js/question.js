function goPlay() {
    $.getJSON("./data/question.json", function (data) {

        const json = data;
        let titleNum = 1; // 大题序号, 从 1 开始取
        let quesNum = 1; // 小题序号,从 0 开始
        let getScore = 0; // 当前分数

        let questionSum = json[titleNum].sum; // 总题数
        let ques = json[titleNum].list; // 大题的问题列表

        // 按照序号存答案，提交后再判断计算分值
        let userList = [];
        let ansList = [];

        // 读取答案
        function getAns() {
            for (var i = 0; i < questionSum; i++) {
                ansList[i] = ques[i].answer
            }
        }

        // 判断答案
        function checkAns(ansList, userList) {
            let sums = 0;
            if (titleNum == 1) {
                //console.log(ansList)
                //console.log(userList)
                let s = 0.5;
                for (var i = 0; i < questionSum; i++) {
                    // 判断用户答案是否正确，正确则加分
                    if (ansList[i] === userList[i]) {
                        sums += s;
                    }
                }
            } else if (titleNum == 2) {
                //console.log(ansList)
                //console.log(userList)
                let s = 2;
                for (var i = 0; i < questionSum; i++) {
                    // 判断用户答案是否正确，正确则加分
                    if (ansList[i] === userList[i]) {
                        sums += s;
                    }
                }
            }
            //console.log(sums)
            return sums;
        }

        $('#prevItem').click(function () {
            if (quesNum > 1) {
                quesNum--;
                queryQues()
            }
            // else if(titleNum > 1){
            //     titleNum--
            //     quesNum = 1
            //     questionSum = json[titleNum].sum;
            //     ques = json[titleNum].list;
            //     userList = [];
            //     ansList = [];
            //     queryQues()
            // }
        })
        $('#nextItem').click(function () {
            if (quesNum < questionSum) {
                quesNum++;
                queryQues()
            }
            else if (quesNum == questionSum) {
                if (titleNum == 1 || titleNum == 2) {
                    //console.log(titleNum)
                    if (window.confirm("是否开始下一个大题，并提交本题？")) {
                        if (titleNum == 1) {
                            getAns()
                            getScore += checkAns(ansList, userList)
                            nextQue()
                        }
                        else if (titleNum == 2) {
                            getAns()
                            getScore += checkAns(ansList, userList)
                            nextQue()
                            //ckScore()
                        }
                    }
                } else {
                    nextQue()
                }

            }
        })

        $('#submit').click(function () {
            if (window.confirm("确认结束并提交吗？")) {
                if (titleNum == 1 || titleNum == 2) {
                    if (userList.length < questionSum) {
                        alert("全部都作答才能提交哦~")
                    }
                    // 如果是第一题，则进入第二题
                    else if (titleNum == 1) {
                        getScore += checkAns(ansList, userList)
                        nextQue()
                    } else if (titleNum == 2) {
                        getScore += checkAns(ansList, userList)
                        ckScore()
                    }
                } else {
                    ckScore()
                }
            }

        })

        function ckScore() {
            if (getScore == 30) {
                $(".s30").css('display', 'block');
            } else if (getScore < 12) {
                $(".s15").css('display', 'block');
            }
        }

        function nextQue() {
            if (titleNum < 6) {
                titleNum++
                quesNum = 1
                questionSum = json[titleNum].sum;
                ques = json[titleNum].list;
                userList = [];
                ansList = [];
                queryQues()
            }
        }

        queryQues()

        // 填充问题
        function queryQues() {

            let questionType = json[titleNum].type; // 类型
            let title = json[titleNum].info; // 大题标题
            let qscore = json[titleNum].score; // 单项分数
            let sumScore = json[titleNum].sumscore; // 大题总分

            let question = ques[quesNum - 1].question// 问题
            let option = ques[quesNum - 1].option;// 选项，列表
            let reflink = ques[quesNum - 1].reflink;// 链接

            // 填充
            $(".ques-sum").html("总分：" + sumScore)
            $(".q-score").html("单项分：" + qscore)

            $(".question-title").html(title)
            nustr = `${quesNum < 10 ? '0' + quesNum : quesNum}`
            $(".question-num").html("序号：" + nustr)
            $(".question-body").html(question)
            $('#areff').attr('href', reflink);

            // 资源链接是否为空
            if (reflink === 'http://blank/') {
                $("#ref-link").css('display', 'none');
            } else if (reflink != 'http://blank/') {
                $("#ref-link").css('display', 'block');
            }

            // 判断题
            if (questionType === 'judge') {
                $(".ans-tip").html("判断问题是否正确：")
                $(".answer-select").css('display', 'block');
                $(".ans-fill").css('display', 'none');
                $(".textarea").css('display', 'none');

                $("#ia").prop("checked", false);
                $("#ib").prop("checked", false);

                document.getElementById('A').innerText = option.A;
                document.getElementById('B').innerText = option.B;

                $("#ia").attr('value', option.A);
                $("#ib").attr('value', option.B);

                $("#ic").css('display', 'none');
                $("#id").css('display', 'none');

                var radio = document.querySelectorAll('input[type=radio]');
                for (var i = 0; i < radio.length; i++) {
                    radio[i].onchange = function (ev2) {
                        var request = { key: '', value: '' };
                        request.key = this.name;
                        request.value = this.value;
                        // 填充选择
                        if (request.value === '' || request.value === undefined || request.value === null) {
                            userList[quesNum - 1] = '-';
                        } else {
                            userList[quesNum - 1] = request.value;
                        }

                        //console.log("用户选择：" + request.value);
                    }
                }
            }
            // 选择
            else if (questionType === 'select') {
                $(".ans-tip").html("选择正确答案：")
                $(".answer-select").css('display', 'block');
                $(".ans-fill").css('display', 'none');
                $(".textarea").css('display', 'none');

                $("#ia").prop("checked", false);
                $("#ib").prop("checked", false);
                $("#ic").prop("checked", false);
                $("#id").prop("checked", false);

                document.getElementById('A').innerText = option.A;
                document.getElementById('B').innerText = option.B;
                document.getElementById('C').innerText = option.C;
                document.getElementById('D').innerText = option.D;

                $("#ia").attr('value', option.A);
                $("#ib").attr('value', option.B);
                $("#ic").attr('value', option.C);
                $("#id").attr('value', option.D);

                $("#ic").css('display', 'inline-block');
                $("#id").css('display', 'inline-block');

                var radio = document.querySelectorAll('input[type=radio]');
                for (var i = 0; i < radio.length; i++) {
                    radio[i].onchange = function (ev2) {
                        var request = { key: '', value: '' };
                        request.key = this.name;
                        request.value = this.value;
                        // 填充选择
                        if (request.value === '' || request.value === undefined || request.value === null) {
                            userList[quesNum - 1] = '-';
                        } else {
                            userList[quesNum - 1] = request.value;
                        }
                        //console.log(request.key);
                        //console.log(request.value);
                    }
                }

            }
            // 填空
            else if (questionType === 'fill') {
                $(".ans-tip").html("填写答案：")
                $(".answer-select").css('display', 'none');
                $(".ans-fill").css('display', 'block');
                $(".textarea").css('display', 'none');

                $(".input1").css('display', 'none');
                $(".input2").css('display', 'none');
                $(".input3").css('display', 'none');

                $(".contents").css('display', 'none');

                let anss = ''
                // 判断几个空
                let l = ques[quesNum - 1].answer.length
                if (l == 1) {
                    $(".input1").css('display', 'inline-block');
                    anss += ques[quesNum - 1].answer[0];
                    document.getElementById('answers').innerText = anss;

                }
                else if (l == 2) {
                    $(".input1").css('display', 'inline-block');
                    $(".input2").css('display', 'inline-block');

                    anss += ques[quesNum - 1].answer[0] + " / "
                    anss += ques[quesNum - 1].answer[1]
                    document.getElementById('answers').innerText = anss;
                } else if (l == 3) {
                    $(".input1").css('display', 'inline-block');
                    $(".input2").css('display', 'inline-block');
                    $(".input3").css('display', 'inline-block');

                    anss += ques[quesNum - 1].answer[0] + " / "
                    anss += ques[quesNum - 1].answer[1] + " / "
                    anss += ques[quesNum - 1].answer[2]
                    document.getElementById('answers').innerText = anss;
                }

            }
            else {
                // treatise  论述  additional  附加题  论述类型
                $(".ans-tip").html("输入回答：")
                $(".answer-select").css('display', 'none');
                $(".ans-fill").css('display', 'none');
                $(".textarea").css('display', 'block');
            }

        }
    });
}

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
}