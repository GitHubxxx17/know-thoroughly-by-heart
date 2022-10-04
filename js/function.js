function $(selectors) {
    if (document.querySelectorAll(selectors).length != 1)
        return document.querySelectorAll(selectors);
    else
        return document.querySelector(selectors);
}

let learningModel = $('.learning_model');
// location.href = '../learningModel.html'
learningModel.onclick = () => {
    learningModel.classList.toggle('enter-anim');
    
}

