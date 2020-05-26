const express = require('express')
const app = express()
const port = 5000

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');

const { User } = require("./models/User");

// application/x-www-form-urlencoded 데이터 분석해서 가져온다
app.use(bodyParser.urlencoded({ extended: true }));
// application/json 데이터 분석해서 가져온다.
app.use(bodyParser.json());
// token을 저장하기 위한 cookieParser를 가져온다.
app.use(cookieParser());

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

app.post('/login', (req, res) => {
  // 1. 요청된 이메일을 데이터베이스에 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
    // 2. 요청된 이메일이 데이터베이스에 있다면 비밀번호가 같은지 확인한다.
    // comparePassword 함수는 User.js에 정의
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch) 
        return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."})
      // 3. 비밀번호까지 맞다면 토큰을 생성한다.
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);
        // 토큰(user.token 필드)을 저장한다. 
          res.cookie("any_name", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id })
      })
    })
  })
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
