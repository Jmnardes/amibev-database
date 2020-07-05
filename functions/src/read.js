// Read (get) - read a specific produt based on ID
app.get('/api/read/:id', (req, res) => {
    
    (async () => {

        try
        {
            const document = db.collection('products').doc(req.params.id);
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
            let query = db.collection('products');
            let response = [];

            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs; // result of the query

                for (let doc of docs)
                {
                    const selectedItem = {
                        id: doc.id,
                        name: doc.data().name,
                        description: doc.data().description,
                        price: doc.data().price
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