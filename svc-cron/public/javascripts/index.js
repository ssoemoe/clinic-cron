$(document).ready(function () {
    let current = 0, max = 10;
    const next = () => {
        if (current === max)
            return;
        current++;
    }

    const prev = () => {
        if (current === 0)
            return;
        current--;
    }

});