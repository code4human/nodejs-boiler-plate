const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String, 
        trim: true,   // 위치 상관없이 존재하는 공백 없애기
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,   // Number가 1이면 관리자, 0이면 일반 유저 식으로 관리 가능
        default: 0
    },
    image: String,   // 이미지는 object로 사용하지 않아보겠다
    token: {   // 토큰으로 유효성 등을 관리 가능
        type: String
    },
    tokenExp: {   // 토큰의 유효기간  
        type: Number
    }
})

// 모델 생성
// mongoose.model('생성할 모델명', 스키마명)
const User = mongoose.model('User', userSchema)

// 모델을 다른 파일에서도 사용하기 위해 exports 해준다.
module.exports = { User }


