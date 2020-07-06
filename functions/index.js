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
            // sequencia de ifs para validar os dados de cadastro
            if(req.body.name === '' || req.body.email === '' || req.body.email2 === '' || req.body.cpf === '' || req.body.cnpj === '' || req.body.password === '' || req.body.password === '' || req.body.date === '') throw "Error";
            if(req.body.email !== req.body.email2 || req.body.password !== req.body.password2) throw "Error";
            if(!validaCPF(req.body.cpf)) throw "Error";
            if(!validaCNPJ(req.body.cnpj)) throw "Error";
            
            // recebendo a coleção usuario e utilizando o snapshot com for pra ler os valores do db
            let query = db.collection('usuarios');
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;

                // faz um for pra verificar existencia de email
                for (let doc of docs)
                {
                    const selectedItem = {
                        email: doc.data().email,
                    };

                    // verifica se email e senha são iguais aos digitados
                    if(req.body.email === selectedItem.email) throw "Error";
                }
            });

            
            // incrementação do id
            id += 1;
            await db.collection('usuarios').doc('/' + id + '/') // chama a coleção de usuarios através do id
            .create({

                // valores do cadastro
                name: req.body.name,
                email: req.body.email,
                email2: req.body.email2,
                cpf: req.body.cpf,
                cnpj: req.body.cnpj,
                password: req.body.password,
                password2: req.body.password2,
                date: req.body.date
            })

            // se não ocorrer nenhum erro ele retorna um success
            return res.status(200).send("success");
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

            // recebe email e password pra validar o perfil
            const email = req.body.email;
            const password = req.body.password;

            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs; // resultado do query

                // faz um for pra achar o perfil da pessoa
                for (let doc of docs)
                {
                    const selectedItem = {
                        id: doc.id,
                        name: doc.data().name,
                        email: doc.data().email,
                        password: doc.data().password,
                    };

                    // verifica se email e senha são iguais aos digitados
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

// app.delete('/api/delete/:id', (req, res) => {
    
//     (async () => {

//         try
//         {
//             const document = db.collection('usuarios').doc(req.params.id);
//             await document.delete();
//             return res.status(200).send();
//         }
//         catch(error)
//         {
//             console.log(error);
//             return res.status(500).send(error);
//         }

//     })();

// });


// Export the api to firebase cloud function
exports.app = functions.https.onRequest(app);