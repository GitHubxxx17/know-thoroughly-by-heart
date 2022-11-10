let label_flag = true;
//点击出现下拉列表
$('.Making_page .label').onclick = (e) => {
    e.stopPropagation();
    if (label_flag) {
        $('.Making_page .label_menu').style.transform = 'scale(1)';
        label_flag = false;
    } else {
        $('.Making_page .label_menu').style.transform = 'scale(0)';
        label_flag = true;
    }
}

//事件委托，为li绑定事件
$('.Making_page .label_menu').onclick = (e) => {
    if (e.target.tagName == 'LI') {
        $('.Making_page .label_cont').innerHTML = e.target.innerHTML;
    }
}

$('.Making_page').onclick = () => {
    $('.Making_page .label_menu').style.transform = 'scale(0)';
    label_flag = true;
}


//富文本防注入
function clearHtml(str) {
    str = str.replace(/<br>/g, '#br#').replace(/<div class="highlight">/g, '#div class="highlight"#').replace(/<\/div>/g, '#</div>#')
    let regex = /(<([^>]+)>)/ig
    return str.replace(regex, "").replace('#br#', '<br>').replace('#div class="highlight"#', '<div class="highlight">').replace('#</div>#', '</div>');
}

$(".Making_page .text_box").onpaste = () => {
    setTimeout(() => {
        $(".Making_page .text_box").innerHTML = clearHtml($(".Making_page .text_box").innerHTML);
    }, 10);
}
let keycode = 0;
$(".Making_page .text_box").onkeyup = (e) => {

    if (e.keyCode == 13) {
        let txt = window.getSelection();
        let range = txt.getRangeAt(0);
        console.log(range, range.anchorOffset);

        for (let x of all(".Making_page .text_box div")) {
            if (!x.classList.contains('highhight')) {

                let br = document.createElement("br");

                range.setStartBefore(x)

                range.insertNode(br)
                range.setStartAfter(br)
                range.setEndAfter(br)

                let arrr = [];
                for (let k of x.childNodes) {
                    if (k.nodeType == '3' && (k.textContent == '\n' || k.textContent == ''))
                        continue;
                    arrr.push(k);
                }

                for (let i = 0; i < arrr.length; i++) {
                    if (i == arrr.length - 1 && arrr[i].nodeName == 'BR')
                        continue;
                    console.log(arrr[i]);
                    $('.Making_page .text_box').insertBefore(arrr[i], x);
                }
                if (keycode == 13) {
                    $(".Making_page .text_box").removeChild(br);
                }
                $(".Making_page .text_box").removeChild(x);
            }
        }
    }
    keycode = e.keyCode;
}

