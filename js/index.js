
for (let i = 0; i < $('footer li').length; i++) {
    $('footer li')[i].onclick = () => {
        if (i != 2) {
            for (let j = 0; j < $('footer li').length; j++) {
                if(j < 4){
                    $('footer .icon')[j].style.fontSize = '10vw';
                    $('.name')[j].style.display = 'block';
                }            
                $('footer li')[j].style.color = '#5e5e5e';
            }
            $('footer li')[i].style.color = '#bb2fff';
            if (i > 2) {
                $('.name')[i - 1].style.display = 'none';
                $('footer .icon')[i - 1].style.fontSize = '17vw';
            }
            else {
                $('.name')[i].style.display = 'none';
                $('footer .icon')[i].style.fontSize = '17vw';
            }

        }
    }


}