var express = require('express');
var router = express.Router();
const webpush = require('web-push');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Web Push Notification Demo', vapid: process.env.VAPID_PUBLIC_KEY });
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
        publicKey: process.env.VAPID_PUBLIC_KEY,
        privateKey: process.env.VAPID_PRIVATE_KEY
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
  }, 30 * 1000);
  res.writeHead(200, {
    'Content-Type': 'text/plain',
  });
  res.end("OK");
});

module.exports = router;
