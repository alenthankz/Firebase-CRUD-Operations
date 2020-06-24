const functions = require('firebase-functions');
const express = require('express');
var admin = require("firebase-admin");
const path = require('path');

var publicPath =path.join(__dirname+'/public')
var serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://naaniztest.firebaseio.com"
});
const db = admin.firestore();

const cors = require('cors');
const app = express();

app.use(cors({orgin:true}));

app.use(express.static(publicPath))

// app.get('/start',(req,res)=>{
//     res.status(200).send('helo');
// })

app.post('/api/create',(req,res)=>{
    (async ()=>{
        try{
            await db.collection('DATA').doc('/'+req.body.id+'/')
            .create({
                name:req.body.name,
                description:req.body.description
            })
            return res.status(200).send();
        }catch{
            return res.status(404).send(error);
        }
    })();
})

app.get('/api/read/:id',(req,res)=>{
    (async ()=>{
        try{
            const document= db.collection('DATA').doc(req.params.id);
            let specificData =await document.get();
            let response =specificData.data();
            return res.status(200).send(response);
        }catch{
            return res.status(404).send(error);
        }
    })();
})
app.get('/api/read',(req,res)=>{
    (async ()=>{
        try{
            let query =db.collection('DATA');
            let response =[];
            await query.get().then(querySnapshot=>{
                for (let doc of docs){
                    const specificData={
                        id:doc.id,
                        name:doc.data().name,
                        description:doc.data().description,
                    };
                    response.push(specificData);
                }
                return res.status(200).send(response);
            })
        }catch{
            return res.status(404).send(error);
        }
    })();
})
app.put('/api/update/:id',(req,res)=>{
    (async ()=>{
        try{
            const document =db.collection('DATA').doc(req.params.id);
            await document.update({
                name:req.body.name,
                description:req.body.description
            });
            return res.status(200).send();
        }catch{
            return res.status(404).send(error);
        }
    })();
})

app.delete('/api/delete/:id',(req,res)=>{
    (async ()=>{
        try{
            const document =db.collection('DATA').doc(req.params.id);
            await document.delete();
            return res.status(200).send();
        }catch{
            return res.status(404).send(error);
        }
    })();
})


exports.app=functions.https.onRequest(app);