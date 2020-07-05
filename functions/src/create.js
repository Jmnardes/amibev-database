// Create (post)
app.post('/api/create', (req, res) => {
    
    (async () => {

        try
        {
            await db.collection('products').doc('/' + req.body.id + '/')
            .create({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price
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