let express = require("express")
let bodyParser = require("body-parser")
let session = require("express-session")
let app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
//middle ware for intisilizing session

app.use(session({
    name:"sid",
    resave : false,
    saveUninitialized : false,
    
    secret:"this_is_my_secret_code",
    cookie:{
        maxAge:1000*30
    }
}))



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
          req.session.username = username
          return  res.redirect("/home")
        }
    }
    res.redirect("/login")
})

app.get("/home",(req,res)=>{
    res.send(`
        <h1>Welcome user</h1>
        <a href="/logout">Logout</a>
        `)
})




app.listen("3047",()=>{
    console.log("server is running on http://localhost:3047/login")
})