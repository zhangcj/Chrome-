//下面超出的部分完全看不到
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
      BookMark.ShowTree();
  }
);

$(function () {
    $(window).keydown(function (event) {
        // Alt + S
        if (event.keyCode == 83 && event.altKey) {
            BookMark.ShowTree();
        }
        if (event.keyCode == 27) {
            //Esc
            BookMark.HideTree();
        }
    });
    messenger = new Messenger('parent', 'MessengerProject');
    //监听消息
    messenger.listen(function (msg) {
        if (msg == "ShowTree")
            BookMark.ShowTree();
        if (msg == "HideTree")
            BookMark.HideTree();
    });
    setTimeout(function () {
        BookMark.ShowTree(true);
    }, 100);
})

var BookMark = {
    //树
    TreeModel: null,
    SettingModel: null,
    ShowTree: function (iFirst) {
        var my_docuemnt;
        try {
            my_docuemnt = top.document;
        }
        catch (ex) {
            my_docuemnt = document;
        }
        if (iFirst) {
            //指定隐藏的话如果已经存在就隐藏
            var frameDIV = my_docuemnt.getElementById("iframe_bookmark");
            if (!frameDIV) {
                //页面首次添加iframe
                var frameURL = chrome.extension.getURL("BookMark/sherpa/default.html");
                //添加外框架
                $(my_docuemnt.body).append("<iframe id=\"iframe_bookmark\" style=\"z-index: 99999999999; position: fixed; top: 0px; left: 0px; width: 100%; height:100%; opacity: 0.99;border:0px;display:none\" src=\"" + frameURL + "\"></iframe>");
                $(window).resize(function () {
                    $("#iframe_bookmark").height($(window).height());
                });
            }
        }
        else {
            //不指定隐藏的话就切换显示
            var frameDIV = my_docuemnt.getElementById("iframe_bookmark");
            if (frameDIV) {
                //已经存在就切换显示
                $(frameDIV).toggle();
                //$(frameDIV).slideToggle(200);
            }
        }
    },
    HideTree: function () {
        var my_docuemnt;
        try {
            my_docuemnt = top.document;
        }
        catch (ex) {
            my_docuemnt = document;
        }
        var frameDIV = my_docuemnt.getElementById("iframe_bookmark");
        if (frameDIV) {
            //已经存在就切换显示
            $(frameDIV).hide();
        }
    }
}