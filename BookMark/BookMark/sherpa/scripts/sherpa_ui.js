$(document).ready(function () {
    //读取初始化配置
    {
        messenger = new Messenger('iframe_bookmark', 'MessengerProject');//父子框架通信机制
        messenger.addTarget(window.parent, 'parent');
        //再加上ESC
        $(window).keydown(function (event) {
            // Alt + S
            if (event.keyCode == 83 && event.altKey) {
                messenger.targets['parent'].send("ShowTree");
            }
            if (event.keyCode == 27) {
                messenger.targets['parent'].send("HideTree");
            }
        });
        //点击页面隐藏UL
        $(window).click(function () {
            $("#side_nav ul ul").hide();
        });
        $("#side_nav").click(function (event) {
            //点击收藏夹取消冒泡给window
            event.stopPropagation();
        });
        chrome.runtime.sendMessage({ type: "GetBookMark" }, function (response) {
            $("#side_nav").append("<ul style=\"width:" + GetULWidth(response[0].children[0].children) + "px\">" + GetHTMLRecursion(response[0].children[0].children) + "</ul>");
            AddFaviconRecursion(response[0].children[0].children);

            $("li").mouseenter(function () {
                if ($(this).children("ul").length > 0) {
                    //显示当前li中ul,如果还没显示的话
                    if ($(this).children("ul")[0].style.display != "block") {
                        //隐藏当前所有同级别li中所有ul,如果当前li中有ul的话
                        $(this).parent().find("ul").hide();
                        $(this).children("ul").show();
                        //判断是否已经越过最右边，越过就往左靠
                        if ($(this).children("ul").offset().left + $(this).children("ul").width() > $(window).width()) {
                            //if (!$(this).children("a span:last").hasClass("left")) {
                            //    $(this).children("a span:last").addClass("left")
                            //}
                            if (!$(this).children("ul").hasClass("slide_left"))
                                $(this).children("ul").addClass("slide_left");
                        }
                        else {
                            //if ($(this).children("a span:last").hasClass("left")) {
                            //    $(this).children("a span:last").removeClass("left")
                            //}
                            //if ($(this).children("ul").hasClass("slide_left"))
                            //    $(this).children("ul").removeClass("slide_left");
                        }
                        //如果收藏夹过高就往上移
                        var heigthDis = $(this).children("ul").offset().top + $(this).children("ul").height() + 30;
                        if (heigthDis > $(window).height()) {
                            if ($(window).height() - heigthDis < -$(this).children("ul").offset().top) {
                                $(this).children("ul").css("top", -$(this).children("ul").offset().top);
                                $(this).children("ul").css("height", $(window).height() - 30);
                                //$(this).children("ul").css("overflow-y", "scroll");
                                //$(this).children("ul").css("overflow-x", "hidden");
                            }
                            else {
                                $(this).children("ul").css("top", $(window).height() - heigthDis);
                            }
                        }
                    }
                }
                return false;
            });
        });
    }

    $('#colour_switcher a').click(function () {
        var colour = $(this).attr('id');
        var cssUrl = ('theme_' + colour + '.css');
        var link = $("<link>");
        link.attr({
            type: 'text/css',
            rel: 'stylesheet',
            href: 'styles/skins/' + cssUrl
        });
        $("head").append(link);
    });

    $('#bg_switcher a').click(function () {
        var link = $(this).attr('href');
        var cssLink = ('url(' + link + ')');
        $(document.body).css('background', cssLink);
        return false;
    });
    //树类,书签树结构展现
    function GetHTMLRecursion(nodes) {
        var nodeHTML = "";
        for (var nodes_index = 0; nodes_index < nodes.length; nodes_index++) {
            var ul_width = 0;
            if (!nodes[nodes_index].children) {
                //没有孩子
                nodeHTML +=
                        "<li><a id=\"site_link_" + nodes[nodes_index].id + "\" target=\"_blank\" href=\"" + nodes[nodes_index].url + "\" title=\"" + nodes[nodes_index].title + "\">" +
                            "<span id=\"site_span_" + nodes[nodes_index].id + "\">" + nodes[nodes_index].title + "</span>" +
                        "</a></li>";
            }
            else {
                //有孩子
                nodeHTML +=
                        "<li><a href=\"#\" title=\"" + nodes[nodes_index].title + "\">" +
                            "<img src=\"images/icons/grey/Folder.png\">" +
                            "<span>" + nodes[nodes_index].title + "</span>" +
                            "<span class=\"icon\">&nbsp;</span></a>";
                nodeHTML += "<ul style=\"width:" + GetULWidth(nodes[nodes_index].children) + "px\">" + GetHTMLRecursion(nodes[nodes_index].children) + "</ul>";
                nodeHTML += "</li>";
            }
        }
        return nodeHTML;
    }
    //获取当前UL最小宽度，遍历Ul下所有LI中的文字
    function GetULWidth(children) {
        var ul_width = 0;
        for (var _index = 0; _index < children.length; _index++) {
            var temp_width = children[_index].title.length * 14;
            if (temp_width > ul_width)
                ul_width = temp_width;
        }
        ul_width += 30;
        return ul_width > 350 ? 350 : ul_width;
    }
    //添加网站前小图标
    function AddFaviconRecursion(nodes) {
        for (var nodes_index = 0; nodes_index < nodes.length; nodes_index++) {
            if (!nodes[nodes_index].children) {
                getImageAsBlob("chrome://favicon/" + nodes[nodes_index].url, "site_link_" + nodes[nodes_index].id, "site_span_" + nodes[nodes_index].id);
            }
            else {
                AddFaviconRecursion(nodes[nodes_index].children);
            }
        }
    }
    ///获取网站图标 reference:https://code.google.com/p/chromium/issues/detail?id=55139
    function getImageAsBlob(url, father_id, reforeNode) {
        chrome.extension.sendRequest({ url: url, method: "getImgDataUrl" }, function (result) {
            var img = document.createElement('img');
            img.style.width = "16px";
            img.style.height = "16px";
            img.style.paddingBottom = "6px";
            img.src = result.data;
            if (document.getElementById(father_id) && document.getElementById(reforeNode)) {
                document.getElementById(father_id).insertBefore(img, document.getElementById(reforeNode));
            }
        });
    }
})