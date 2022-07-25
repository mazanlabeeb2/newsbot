let moment = require('moment-timezone');
let time = moment('2022-07-25T07:41:36.000+00:00').tz('Asia/Karachi').format('HH:mm, YYYY-MM-DD')
console.log(time)