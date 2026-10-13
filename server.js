let express = require("express")
let bodyParser = require("body-parser")
// let session = require("express-session")
let jwt = require("jsonwebtoken")
let cookieParser = require("cookie-parser")

let jwtSecret = "thisisjwtsecrectcode"

let app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser())
//middle ware for intisilizing session

// app.use(session({
//     name:"sid",
//     resave : false,
//     saveUninitialized : false,
//     secret:"this_is_my_secret_code",
//     cookie:{
//         maxAge:1000*30
//     }
// }))

// function requireAuth(req,res,next){
//     if(!req.session.username){
//         return res.redirect("/login")
//     }
//     next()
// }

function verifyToken(req,res,next){
    const token = req.cookies.token
    if(!token){
        return res.status(401).send("Token not found")
    }
    jwt.verify(token,jwtSecret,(err,decoded)=>{
        if(err){
            console.log("invalid token")
            res.status(403).send("invalid or expired Token")
        }
        req.user = decoded
        next()
    })
}






let users = [
    {username:"shaan",password:"123456"}
]
//login page


app.get("/login",(req,res)=>{
    res.send(`
        <h1>Login Page</h1>
        <form action="/login" method="POST">
            Username : <input type="text" name="username" />
            Password : <input type="password" name="password" />
            <button type="submit">Login</button>
        </form>
        `)
})

app.post("/login",(req,res)=>{
    console.log(req.body)
    let {username,password} =  req.body
    if(username && password){
        // database me search karenge
        let user = users.find((u)=>u.username==username && u.password==password)

        if(user){
        //   req.session.username = username
           let token= jwt.sign({username:user.username},jwtSecret,{
            expiresIn : "20s"
           })

           //putting token inside cookie
           res.cookie("token",token,{
            httpOnly : true,
            maxAge : 1000*50
           })
            
          return  res.redirect("/home")
        }
    }
    res.redirect("/login")
})

app.get("/home",verifyToken,(req,res)=>{
    res.send(`
        <h1>Welcome user</h1>
        <a href="/logout">Logout</a>
        `)
})

app.get("/logout",(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log(err)
        }
        res.clearCookie("sid")
        res.redirect("/login")
    })
})


app.listen("3047",()=>{
    console.log("server is running on http://localhost:3047/login")
})