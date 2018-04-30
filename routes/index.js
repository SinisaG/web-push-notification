var express = require('express');
var router = express.Router();
const webpush = require('web-push');
const VAPID = require('../config/vapid.json');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Homeday Push' });
});

router.post('/subscribe', function(req, res, next) {
  setTimeout(() => {
    const payload = {
      title: 'Hello from Homeday!',
      body: 'Click here to visit us!'
    };
    const options = {
      TTL: 24 * 60 * 60,
      vapidDetails: {
        subject: 'mailto:sinisa.grubor@homeday.de',
        publicKey: VAPID.publicKey,
        privateKey: VAPID.privateKey
      },
    }
    webpush.sendNotification(
      req.body,
      Buffer.from(JSON.stringify(payload)),
      options
    ).then(() => {
      // all good
    }).catch( (e) => {
      console.log(e);
    });
  }, 1000);
  res.writeHead(200, {
    'Content-Type': 'text/plain',
  });
  res.end("OK");
});

module.exports = router;
