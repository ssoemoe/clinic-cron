const axios = require("axios");
const code = 'Mm2eSE4EpQkyU0ZAsW7aA7R3VSotSv'; // given out when authorized via UI page
const url = `https://drchrono.com/o/authorize`;
axios.post(url, {
    'code': code,
    'grant_type': 'authorization_code',
    'redirect_uri': 'https://clinic-cron.tk',
    'client_id': 'FXGdZVM66p1Bb3cJY5upbu19T77NIOsnOvSDJXch',
    'client_secret': 'jBLLxG6fOyxYIymXiWyPHDrTnaAuqALI1BH24KXxt3kY190umDl9cW5ZReCuvyXkOGDKC6Jvenrt0kvtCzGhVvLGqiOB4KbpWb2j6KPY4VftNyn59YFukwkoXsi4J9rD',
}).then(function (response) {
    console.log(response['access_token']);
    console.log(response['refresh_token']);
    console.log(response);
})
