$(document).ready(function () {
    let current = 0;
    let params = {};
    const divs = ['first', 'second', 'third'];
    const url = window.location.href;
    const keyValuePairs = url.split('?')[1].split('&');
    for (let kv of keyValuePairs) {
        let key = kv.split("=")[0].trim();
        let value = kv.split("=")[1].trim();
        params[key] = value;
    }
    const patientId = Number(params["id"]);

    // init
    $('#new-patient-form').html($(`#${divs[0]}`).html());
    $('#prev').hide();

    const slide = (direction) => {
        if (direction === 'next' && current === divs.length - 1) return;
        if (direction === 'prev' && current === 0) return;
        current = direction === 'next' ? current + 1 : current - 1;
        currentDiv = `#${divs[current]}`;
        $('#new-patient-form').html($(currentDiv).html());
        if (current !== 0) $('#prev').show();
        else $('#prev').hide();
        if (current === divs.length - 1) $('#next').hide();
        else $('#next').show();
    }

    $('#next').on('click', function () { slide('next'); });
    $('#prev').on('click', function () { slide('prev'); });
});