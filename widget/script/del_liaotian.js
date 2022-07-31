function touchstartF(event) {
    x = event.changedTouches[0].pageX;
    y = event.changedTouches[0].pageY;
    swipeX = true;
    swipeY = true;
};

function touchmoveF(event, e) {
    X = event.changedTouches[0].pageX;
    Y = event.changedTouches[0].pageY;
    // 左右滑动
    if (swipeX && Math.abs(X - x) - Math.abs(Y - y) > 0) {
        // 阻止事件冒泡
        event.stopPropagation();
        if (X - x > 10) {
            event.preventDefault();
            e.style.WebkitTransform = "translateX(" + 0 + "px)";
            e.style.transition = "-webkit-transform 300ms ease-in-out";
            e.nextElementSibling.setAttribute('class', 'del new-hide');
        }
        if (x - X > 10) {
            event.preventDefault();
            e.style.WebkitTransform = "translateX(" + -80 + "px)";
            e.style.transition = "-webkit-transform 300ms ease-in-out";
            e.nextElementSibling.setAttribute('class', 'del');
        }
        swipeY = false;
    }
    // 上下滑动
    if (swipeY && Math.abs(X - x) - Math.abs(Y - y) < 0) {
        swipeX = false;
    }
};


function toDelete(event, e) {
    var deleteL = document.querySelectorAll('.delete');
    var wrapper = document.querySelectorAll('.wrapper');
    for (var i = 0; i < wrapper.length; i++) {
        wrapper[i].style.transition = 'height 500ms';
        wrapper[i].style.webkitTransition = 'height 500ms';
        wrapper[i].style.overflow = 'hidden';
    }
    var deleteLB = e;

    var down = deleteLB.parentNode;
    if (down.clientHeight == '100') {
        // deleteLB.parentNode.style.height = '0';
        deleteLB.parentNode.classList.add('noheight');
        setTimeout(function () {
            down.remove();
        }, 700);
    }

}