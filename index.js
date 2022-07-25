require('dotenv').config();

const mongoose = require('mongoose');
const wppconnect = require('@wppconnect-team/wppconnect');
const express = require('express');
let moment = require('moment-timezone');

const app = new express();
const port = 8080 || process.env.PORT;
app.listen(port, () => { console.log(`Server: http://localhost:${port}`) });

// +++++++++++++++++++Database Config +++++++++++++++++++++++
mongoose.connect(process.env.MONGO)
  .then(() => console.log("Connection to Database: Success"))
  .catch((e) => console.log(e));

let usersSchema = mongoose.Schema({
  user_id: {
    type: String,
    unique: true
  },
  language: String
})
let users = mongoose.model('users', usersSchema);
// other db schema
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
// +++++++++++++++++++Database Config +++++++++++++++++++++++


wppconnect.create({
  // ...
  session: 'mySessionName',
  puppeteerOptions: {
    userDataDir: './tokens/mySessionName', // or your custom directory
  }, 
  //  headless: true, // Headless chrome
  // devtools: false, // Open devtools by default
  // useChrome: false, 
  // ...
}).then((client) => start(client)).catch((error) => console.log(error));



// server



function start(client) {

  app.use(express.urlencoded({ extended: true }));
  app.post('/api',  (req, res) => {
    users.find({language:req.body.language}).then(async (d) => {
      for (var i = 0; i < d.length; i++) {
        let caption = `*${req.body.title.trim()}*\n \n${req.body.body.trim()}\n \n*Posted:* ${ moment(req.body.created_at).tz('Asia/Karachi').format('HH:mm, YYYY-MM-DD')}`;
        await client
          .sendImage(
            d[i].user_id,
            req.body.thumbnail,
            'mazanlabeeb',
            caption
          ).then((result) => { res.send('Sent to user.') ; }).catch((erro) => { console.error('Error when sending: ', erro); });
      }
    })



  })

  client.onMessage(async (message) => {
    if (message.body.toLowerCase().startsWith('help')) {
      client.sendText(message.from, 'Get latest Pakistani News in English or Urdu. Click on the subscribe button and choose your preferred language to subscribe to news channel.\n\n You can unsubscribe at any time.', {
        useTemplateButtons: true, // False for legacy
        buttons: [
          {
            url: 'https://mazanlabeeb.me/',
            text: 'Help'
          },
          {
            phoneNumber: '+923061695230',
            text: 'Contact Us'
          },
          {
            id: 'your custom id 1',
            text: 'Subscribe'
          },
          {
            id: 'another id 2',
            text: 'Unsubscribe'
          }
        ],
        title: 'News Bot',
        footer: 'This bot has been created with 💚 by Mazan Labeeb.' // Optional
      });


    }
    if (message.body.toLowerCase().startsWith('subscribe')) {
      client.sendText(message.from, 'Choose your preferred language.', {
        useTemplateButtons: true, // False for legacy
        buttons: [
          {
            id: 'your custom id 1',
            text: 'English'
          },
          {
            id: 'another id 2',
            text: 'Urdu'
          }
        ],
        title: 'News Bot'
      });


    }
    if (message.body.toLowerCase() === 'english' || message.body.toLowerCase() === 'urdu') {
      var language = message.body.toLowerCase();
      let count = await users.countDocuments({ user_id: message.from })
      if (count < 1) {
        let row = new users({
          user_id: message.from,
          language: language
        })
        row.save().then(() => {
          console.log('New user added to the database')
          client
            .sendText(message.from, 'Thanks for subscribing to news service. 😄')
            .then()
            .catch((erro) => {
              console.error('Error when sending: ', erro);
            });
        }).catch((e) => console.log(e));
      } else {
        client
          .sendText(message.from, 'You have already subscribed to our service. 🙁 ')
          .then()
          .catch((erro) => {
            console.error('Error when sending: ', erro);
          });
      }

    }

    if (message.body.toLowerCase() === 'unsubscribe') {

      let count = await users.countDocuments({ user_id: message.from })
      if (count > 0) {
        users.deleteOne({
          user_id: message.from
        }).exec()
          .then(() => {
            console.log('User removed from database.')
            client
              .sendText(message.from, 'You have unsubscribed to our service. 🙁')
              .then()
              .catch((erro) => {
                console.error('Error when sending: ', erro);
              });
          }).catch((e) => console.log(e));
      } else {
        client
          .sendText(message.from, 'This action cannot be performed 😠\nYou have not subscribed to our service. 🙁 ')
          .then()
          .catch((erro) => {
            console.error('Error when sending: ', erro);
          });
      }

    }

  });
}



// client
      //   .sendText(message.from, 'Hello, how I may help you?')
      //   .then((result) => {
      //     console.log('Result: ', result); //return object success
      //   })
      //   .catch((erro) => {
      //     console.error('Error when sending: ', erro); //return object error
      //   });
      // With buttons













