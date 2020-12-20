/* This shows the URL to be opened in the browser for the UI page to login and authorize */
const REDIRECT_URI = encodeURIComponent("https://clinic-cron.tk");
const CLIENT_ID = encodeURIComponent("FXGdZVM66p1Bb3cJY5upbu19T77NIOsnOvSDJXch");
// omitted to default to all scopes
const url = `https://drchrono.com/o/authorize/?redirect_uri=${REDIRECT_URI}&response_type=code&client_id=${CLIENT_ID}`;
console.log(url);
