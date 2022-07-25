require('dotenv').config()
const newspk = require('newspk');
const mongoose = require('mongoose');
var axios = require('axios');
var qs = require('qs');

mongoose.connect(process.env.MONGO)
    .then(() => console.log('Database Connection : Ok'))
    .catch((e) => console.log('Database Connection : Failed\nError:' + e))

let englishSchema = mongoose.Schema({
    unique_id: {
        type: Number,
        unique: true
    },
    title: String,
    thumbnail: String,
    body: String,
    created_at: Date
}, { collection: 'English' })

let urduSchema = mongoose.Schema({
    unique_id: {
        type: Number,
        unique: true
    },
    title: String,
    thumbnail: String,
    body: String,
    created_at: Date
}, { collection: 'Urdu' })

let englishNews = mongoose.model('english', englishSchema);
let urduNews = mongoose.model('Urdu', urduSchema);

newspk.news(5, 'english').then(async (data) => {
    for (var i = 0; i < data.length; i++) {
        d = data[i];
        let len = await englishNews.countDocuments({
            unique_id: d.unique_id
        })
        if (len < 1) {
            let row = new englishNews({
                unique_id: d.unique_id,
                title: d.title,
                thumbnail: d.thumbnail,
                body: d.body,
                created_at: d.created_at
            })
            row.save().then((d) => {
                // DO NOW////////////////////////////////
                var axios = require('axios');
                var qs = require('qs');
                var data = qs.stringify({
                    'title': d.title,
                    'thumbnail': d.thumbnail,
                    'body': d.body,
                    'created_at': d.created_at,
                    'language': 'english'
                });
                var config = {
                    method: 'post',
                    url: 'http://localhost:80/api',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: data
                };

                axios(config)
                    .then(function (response) {
                        console.log(response.data);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

                // DO NOW////////////////////////////////
            }).catch((e) => console.log('Failed to add an entry'));


        }


    }
})




newspk.news(5, 'urdu').then(async (data) => {
    for (var i = 0; i < data.length; i++) {
        d = data[i];
        let len = await urduNews.countDocuments({
            unique_id: d.unique_id
        })
        if (len < 1) {
            let row = new urduNews({
                unique_id: d.unique_id,
                title: d.title,
                thumbnail: d.thumbnail,
                body: d.body,
                created_at: d.created_at
            })
            row.save().then(() => {
                //dow now URDU
                 // DO NOW////////////////////////////////
                 var axios = require('axios');
                 var qs = require('qs');
                 var data = qs.stringify({
                     'title': d.title,
                     'thumbnail': d.thumbnail,
                     'body': d.body,
                     'created_at': d.created_at,
                     'language': 'urdu'
                 });
                 var config = {
                     method: 'post',
                     url: 'http://localhost:80/api',
                     headers: {
                         'Content-Type': 'application/x-www-form-urlencoded'
                     },
                     data: data
                 };
 
                 axios(config)
                     .then(function (response) {
                         console.log(response.data);
                     })
                     .catch(function (error) {
                         console.log(error);
                     });
 
                 // DO NOW////////////////////////////////
                //dow now URDU

            }).catch((e) => console.log('Failed to add an entry'));
        }


    }
})



