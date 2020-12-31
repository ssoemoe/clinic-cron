$(document).ready(function () {
    let current = 0, max = 10;
    const
    const next = () => {
        if (current === max)
            return;
        current++;
        $('.new-patient-form').html('');
        $('.new-patient-form').append();
    }

    const prev = () => {
        if (current === 0)
            return;
        current--;
    }
});