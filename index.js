const express = require('express')
const app = express()
const port = 5000

const bodyParser = require('body-parser');

const config = require('./config/key');

const { User } = require("./models/User");

// application/x-www-form-urlencoded 데이터 분석해서 가져온다
app.use(bodyParser.urlencoded({ extended: true }));
// application/json 데이터 분석해서 가져온다.
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))
  
app.get('/', (req, res) => res.send('Hello World!'))

app.post('/register', (req, res) => {
  // 회원가입 할 때 필요한 정보를 client(브라우저)에서 가져오면
  // 그 데이터를 데이터베이스에 넣어준다.

  // request의 body 안에는 json 형식으로 객체처럼 들어있다.
  // 모든 정보를 User 모델에 넣어준다.
  const user = new User(req.body)   

  // save 전에 비밀번호 암호화 : User.js의 userSchema.pre()

  // save
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true
    })
  })
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
