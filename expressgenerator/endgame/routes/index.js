var express = require('express');
var router = express.Router();

const userModel = require('./users')
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/contact', async function(req, res)
{
  let userdata = await userModel.create(
    {
      username: "Rehan",
      nickname: "hakim",
      description: "I am Rehan, a passionate developer.",
      categories: ["gamer", "Affilate"]
    }
  )
  res.send(userdata);
})

router.get('/find', async function(req, res)
{
  var regex = new RegExp("^Rubina$", 'i');
  let usercom = await userModel.find({username : regex})
  res.send(usercom);
})

module.exports = router;
