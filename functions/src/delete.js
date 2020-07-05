// Delete (delete)
app.delete('/api/delete/:id', (req, res) => {
    
    (async () => {

        try
        {
            const document = db.collection('products').doc(req.params.id);
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