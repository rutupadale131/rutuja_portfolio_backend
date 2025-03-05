const express=require("express");
const nodemailer=require("nodemailer");
const cors=require("cors");
const dotenv=require("dotenv") ;

dotenv.config()

const app=express();

app.use(cors({
    origin:"*",
     methods: ["POST"],
    allowedHeaders: ["Content-Type"]
}));
const PORT=process.env.PORT||5000;

app.use(express.json());

const initializeServer= ()=>{
    try{
        app.listen(PORT,()=>(console.log(`Server running on port ${PORT}`)))
    }catch(error){
        console.log("Server Error:",error);
    }
}



app.post("/send-message",async (req,res)=>{
    const {name,email,message}=req.body

    try{
        const transporter=nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS
            },
        })
        
        const mailOptions={
            from:process.env.EMAIL_USER,
            replyTo:email,
            to:process.env.EMAIL_USER,
            subject:`New message from ${name}`,
            text:`Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({message:"Message sent successfully!"});
    }catch(error){
        res.status(500).json({message:"Error sending message"})
    }
});

initializeServer()