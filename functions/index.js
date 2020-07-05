const functions = require('firebase-functions');

var admin = require("firebase-admin");

var serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://amibev-b2cfe.firebaseio.com"
});

const express = require('express');
const app = express();
const db = admin.firestore();

const cors = require('cors');
app.use( cors( { origin:true } ) );
let id = 0;


// CADASTRO

app.post('/api/sign', (req, res) => {
    
    (async () => {

        try
        {
            if(req.body.email !== req.body.email2 || req.body.password !== req.body.password2){
                 throw "Error"
            }else{
                id += 1;
                await db.collection('usuarios').doc('/' + id + '/')
                .create({
                    name: req.body.name,
                    email: req.body.email,
                    email2: req.body.email2,
                    cpf: req.body.cpf,
                    cnpj: req.body.cnpj,
                    password: req.body.password,
                    password2: req.body.password2,
                    date: req.body.date
                })
                return res.status(200).send("success");
            }
        }
        catch(error)
        {
            console.log(error);
            return res.status(500).send(error);
        }

    })();
    return;
});


// LOGIN

app.get('/api/login', (req, res) => {
    (async () => {

        try
        {
            let query = db.collection('usuarios');
            let response = [];
            const email = req.body.email;
            const password = req.body.password;

            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs; // result of the query

                for (let doc of docs)
                {
                    const selectedItem = {
                        id: doc.id,
                        name: doc.data().name,
                        email: doc.data().email,
                        password: doc.data().password,
                    };

                    if(email === selectedItem.email && password === selectedItem.password){        
                        response.push(selectedItem);                
                        return res.status(200).send(response);
                    }
                }
            return;
            });
        }
        catch(error)
        {
            console.log(error);
            return res.status(500).send(error);
        }
        return;
    })();
    return;
});


// DELETE

app.delete('/api/delete/:id', (req, res) => {
    
    (async () => {

        try
        {
            const document = db.collection('usuarios').doc(req.params.id);
            await document.delete();
            return res.status(200).send();
        }
        catch(error)
        {
            console.log(error);
            return res.status(500).send(error);
        }

    })();

});


// Export the api to firebase cloud function
exports.app = functions.https.onRequest(app);