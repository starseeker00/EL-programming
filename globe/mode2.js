if (!Detector.webgl) {
    Detector.addGetWebGLMessage();
} else {

    var container = document.getElementById('globe');
    var globe = new DAT.Globe(container);
    var totalDay = 0;

    // 加载数据
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'globe/data.json', true);
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState === 4 && xhr.status === 200) {

            var data = JSON.parse(xhr.responseText);
            window.data = data;
            totalDay = data.length;
            for (var i = 0; i < data.length; i++) {
                globe.addData(data[i][1], { format: 'magnitude', name: data[i][0], animated: true });
            }
            globe.createPoints();
            settime(globe, 0)();
            globe.animate();
            document.body.style.backgroundImage = 'none'; // remove loading

            // 加载完成后使按钮有效
            nextButton.addEventListener("click", buttonFunc(1,totalDay));
            preButton.addEventListener("click", buttonFunc(-1,totalDay));
        }
    };
    xhr.send(null);

    // 补间动画
    var tweens = [];
    TWEEN.start();
    var settime = function (globe, t) {
        return function () {
            new TWEEN.Tween(globe).to({ time: t / totalDay }, 500).easing(TWEEN.Easing.Cubic.EaseOut).start();
        };
    };
}

let returnButton = document.getElementById("returnButton");
let nextButton = document.getElementById("nextButton");
let preButton = document.getElementById("preButton");
let introduction = document.getElementById("introduction");
let nodeImage=document.getElementById("nodeImage");


let nodeNow = 0;
// 按钮函数
function buttonFunc(next, totalDay) {
    return function () {
        // 最初的数据日期，如果修改需要更改
        let startDate = new Date("2020-01-22");
        // 如果有新的节点需要在这里添加时间，同时图片的命名也按照下面的时间格式
        let nodes = ["2019-12-01", "2020-01-05", "2020-01-10", "2020-01-15",
            "2020-01-23", "2020-02-06", "2020-02-07", "2020-02-16", "2020-03-14",
            "2020-03-31", "2020-04-04", "2020-04-08", "2020-04-23"];
        nodeNow += next;
        nodeNow %= nodes.length;
        if (nodeNow < 0) {
            nodeNow += nodes.length;
        }
        let nodeDate=new Date(nodes[nodeNow]);
        let timenow = 0;
        
        if (nodeDate.getTime()>startDate.getTime()){
            timenow=Math.round((nodeDate.getTime()-startDate.getTime())/86400000);
            timenow=Math.min(timenow,totalDay-1);
        }
        // 节点的文字介绍
        introduction.textContent = nodeDate.toDateString();
        let imageSrc="styles/images/mode2/"+nodes[nodeNow]+".png";
        nodeImage.setAttribute('src', imageSrc);
        // debugger;
        settime(globe, timenow)();
    }
}

returnButton.addEventListener("click", returnToMenu);
function returnToMenu() {
    window.location.replace('index.html')
}