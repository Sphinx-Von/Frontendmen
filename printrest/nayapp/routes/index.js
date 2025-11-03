var express = require('express');
var router = express.Router();

const userModel = require('./users')
const postModel =  require('./post')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/create', async function (req, res, next)
{
  let user = await userModel.create(
    {
      username: "Rubina",
    password: "rubina123",
    email: "rubinahakim95@gmail.com",
    fullName: "Rubina Hakim",
    posts: []
    }
  )
  res.send(user)
})

router.get('/post' , async function(req, res, next)
{
  let post =await  postModel.create(
    {
      postText:"This is my first post!"
    }
  )
   res.send(post)
})

module.exports = router;
