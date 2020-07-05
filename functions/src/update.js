// Update (put) - update by id
app.put('/api/update/:id', (req, res) => {
    
    (async () => {

        try
        {
            const document = db.collection('products').doc(req.params.id);

            await document.update({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price
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