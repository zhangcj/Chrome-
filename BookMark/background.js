//书签数据，如果被编辑，应该重新赋值
var bookMarkData = null;
chrome.bookmarks.getTree(function (aBookMark) {
    bookMarkData = aBookMark;
});
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
      switch (request.type) {
          case "GetBookMark":
              sendResponse(bookMarkData);
              break;
          default: break;
      }
  }
);
///获取网站图标 reference:https://code.google.com/p/chromium/issues/detail?id=55139
function imgToCanvas(img) {
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    var context = canvas.getContext("2d");
    context.drawImage(img, 0, 0);
    return canvas;
}

function getImgDataUrl(url, cb) {
    var img = document.createElement('img');
    img.onload = function () {
        var canvas = imgToCanvas(img);
        var dataUrl = canvas.toDataURL('image/png', 0.75);
        cb({
            data: dataUrl
        });
    };
    img.src = url;
}

chrome.extension.onRequest.addListener(function (req, sender, sendResponse) {
    switch (req.method) {
        case "getImgDataUrl":
            return getImgDataUrl(req.url, sendResponse);
    }
});