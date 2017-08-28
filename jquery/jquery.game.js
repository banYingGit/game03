//
/* 全局变量
 * grade：果实树的等级 默认2为出现两个果实
 * treeArr：树上果实
 * clickN：点击果实次数
 * atuoLight：自动亮灯
 * errorNum：每级错误次数
 * sysTimeN：游戏开始时间
 * sysTimeO：游戏结束时间
 * sumTime：总计用时
 * stateN：当前亮灯索引
 * errorCli: 练习时点击错误次数
 */

var grade = 2, treeArr = [], clickN = 0, atuoLight, errorNum = 0, sysTimeN, sysTimeO, sumTime = 0, stateN = 0,
    errorCli = 0

var trees = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

_event()

// 游戏内事件处理
function _event() {

    $('#goscreen2').click(function () {

        $('#screen1').remove()

        $('#screen2').show()

    });
    $('#goscreen3').click(function () {

        $('#screen2').remove()

        $('#screen3').show()

        _setTree()

    });
    $('#stopBtn').click(function () {

        $('#screenStop').show()

    });
    $('#continue').click(function () {

        $('#screenStop').hide()

    });
    $('#againBtn').click(function () {

        $(this).parents('.againScr').hide()

        _setTree()

    });
    $('#start').click(function () {

        $('#startTip').remove()

        $('#screen3').show()

        _setTree()

        $('#stopBtn').show()

        sysTimeN = new Date()

    });

    $('#stopBtn').click(function () {

        sysTimeO = new Date()

        var curTime = (sysTimeO - sysTimeN) / 1000

        sumTime = sumTime + curTime


        $('#screenStop').show()

        $('#screen3').hide()

        //停止亮灯
        clearInterval(atuoLight)


    })

    $('#continue').click(function () {

        sysTimeN = new Date()

        $('#screenStop').hide()

        $('#screen3').show()


        //继续亮灯
        _light()

    })

    $('img[data-role="signOut"]').click(function () {

        _out()

    })


}

//游戏结束
function _over() {

    $('#uesTime').text(sumTime)
    $('#score').text(grade)


    /* ajax 请求接口路径，返回json 数据
     * grade: 当前显示等级
     * sumTime：游戏总用时长
     * */

    var param = {

        grade: grade,

        sumTime: sumTime

    }

    console.log('当前返回参数', param)

}

// 点击果实事件
function _imgClick(e) {

    var dataSrc = $(e.target).attr('src'),

        dataRole = $(e.target).attr('data-role')

    //灯没绿不让点
    if (dataSrc.indexOf('guoshi2') != -1) {

        clickN = clickN + 1

        if (treeArr[clickN - 1] == dataRole) {


            $(e.target).attr('src', 'img/guoshi1.png')

            var treeNum = treeArr.length

            console.log('treeNum', treeNum)

            if (clickN == treeNum) {

                if ($('#startTip').length > 0) {

                    setTimeout(function () {

                        $('#screen3').hide()
                        $('#startTip').show()

                    }, 500)

                } else {

                    if (grade >= 10) {

                        $('#screen3').remove()
                        $('#screen4').show()

                        sysTimeO = new Date()

                        var curTime = (sysTimeO - sysTimeN) / 1000

                        sumTime = parseInt(sumTime + curTime)

                        console.log('游戏做完结束用时', sumTime)

                        _over()


                    } else {
                        grade = grade + 1

                        errorNum = 0

                        setTimeout(function () {

                            _setTree()
                        }, 1000)


                    }

                }
            }


        } else {


            $(e.target).attr('src', 'img/guoshi3.png')


            if ($('#startTip').length <= 0) {

                errorNum = errorNum + 1

                $('ul[data-role="trees"] > li').find('img').removeAttr('onclick')

                if (errorNum == 3) {

                    setTimeout(function () {
                        $('#screen3').remove()
                        $('#screen4').show()

                        sysTimeO = new Date()

                        var curTime = (sysTimeO - sysTimeN) / 1000

                        sumTime = parseInt(sumTime + curTime)

                        // console.log('错误3次游戏结束用时', sumTime)

                        _over()
                    }, 2000)

                } else {
                    
                    // console.log('错误了多少次', errorNum)
                    setTimeout(function () {
                        _setTree()
                    }, 2000)

                }

            } else {


                errorCli = errorCli + 1

                if (errorCli < 2) {

                    $('#againBtn').parents('.againScr').show()

                } else if (errorCli == 2) {

                    setTimeout(function () {

                        $('#screen3').hide()
                        $('#startTip').show()

                    }, 500)


                }


            }


        }

    }


}

//游戏退出
function _out() {

    console.log('游戏退出')

}

//果实树
function _setTree() {

    //清空果实
    $('ul[data-role="trees"] > li').find('img').attr({
        'src': 'img/seat.png',
        'onclick': ''
    })
    $('ul[data-role="trees"] > li').find('img').removeAttr('data-role')

    treeArr = []

    clickN = 0


    //获取树上的小果实
    // console.log('grade', grade)

    treeArr = _getArrayItems(trees, grade)


    for (var i = 0; i < treeArr.length; i++) {

        $('ul[data-role="trees"] > li').eq(treeArr[i]).find('img').attr({
            'src': 'img/guoshi2.png',
            'data-role': treeArr[i]
        })


    }
    // console.log('>>>treeArr', treeArr)

    _light()

}

/*** 设置树上果实每隔2秒亮一个 ***/
function _light() {

    var i = treeArr.length


    var timeFn = function () {

        stateN = stateN + 1

        $('ul[data-role="trees"] > li').eq(treeArr[stateN - 1]).find('img').attr('src', 'img/guoshi1.png')

        // console.log('当前亮灯顺序', (treeArr[n - 1]))

        if (stateN > i) {

            clearInterval(atuoLight)

            setTimeout(function () {


                $('ul[data-role="trees"] > li').find('img[data-role]').attr({
                    'onclick': '_imgClick(event)',
                    'src': 'img/guoshi2.png'
                })

                stateN = 0


            })


        }

    }

    atuoLight = setInterval(timeFn, 1500);

}


/*** 数组随机
 * arr：数组
 * num：随机个数
 ***/
function _getArrayItems(arr, num) {

    var array = [];

    for (var index in arr) {

        array.push(arr[index]);
    }

    var return_array = [];

    for (var i = 0; i < num; i++) {

        if (array.length > 0) {

            var arrIndex = Math.floor(Math.random() * array.length);

            return_array[i] = array[arrIndex];

            array.splice(arrIndex, 1);

        } else {
            break;
        }
    }
    return return_array;
}






