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


//Routes
app.get('/hello-world', (req, res) => {
    return res.status(200).send('Hello World!');
});


// Create (post) - cadastro
app.post('/api/create', (req, res) => {
    
    (async () => {

        try
        {
            await db.collection('usuarios').doc('/' + req.body.id + '/')
            .create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })

            return res.status(200).send();
        }
        catch(error)
        {
            console.log(error);
            return res.status(500).send(error);
        }

    })();

});


// Read (get) - read a specific produt based on ID
app.get('/api/read/:id', (req, res) => {
    
    (async () => {

        try
        {
            const document = db.collection('usuarios').doc(req.params.id);
            let product = await document.get();
            let response = product.data();

            return res.status(200).send(response);
        }
        catch(error)
        {
            console.log(error);
            return res.status(500).send(error);
        }

    })();

});


// Read (get) - read all produts
app.get('/api/read', (req, res) => {
    
    (async () => {

        try
        {
            let query = db.collection('usuarios');
            let response = [];

            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs; // result of the query

                for (let doc of docs)
                {
                    const selectedItem = {
                        id: doc.id,
                        name: doc.data().name,
                        email: doc.data().email,
                        password: doc.data().password
                    };
                    response.push(selectedItem);
                }
                return response; // each then should return a value
            });
            return res.status(200).send(response);
        }
        catch(error)
        {
            console.log(error);
            return res.status(500).send(error);
        }

    })();

});


// Update (put) - update by id
app.put('/api/update/:id', (req, res) => {
    
    (async () => {

        try
        {
            const document = db.collection('usuarios').doc(req.params.id);

            await document.update({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });

            return res.status(200).send();
        }
        catch(error)
        {
            console.log(error);
            return res.status(500).send(error);
        }

    })();

});


// Delete (delete)
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