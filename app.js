let MongoClient = require('mongodb').MongoClient;
let ObjectID = require('mongodb').ObjectID;
let express = require('express');
let bodyParser = require('body-parser');
let ido;



let urlencodedParser = bodyParser.urlencoded({ extended: false });

let app = express();

//set up a template engine
app.set('view engine', 'ejs');

// static files
app.use(express.static('public'));

// Connection to the db, create collection and insert data to the collection
MongoClient.connect('mongodb://localhost/', {useNewUrlParser: true }, function (err, db) {
    if (err) {
        throw err;
    } else {
        console.log('Connected to the server on port 8080');
        
        let mydb = db.db('banka');
        mydb.createCollection('accounts', function(err, accounts){
            if (err) throw err;
            //     // insert document to the collection
            //     mydb.collection('accounts').insertOne({name: "Rade", deposit: 10000, card: "Visa"}, function(err, res){
            //        if (err) throw err;
            //        console.log('document inserted');
            //    });
        });
        // get data from the db and add them to the view
        app.get('/', function (req, res) {
            mydb.collection('accounts').find({}).toArray(function(err, accounts){
                if (err) throw err;
                // console.log(accounts);
                res.render('accounts', {
                    accounts: accounts
                });
            })
        });

        // add account view
        app.get('/add_account', function (req, res) {
            res.render('add_account');
        });
        
        // add account to the db and send to the view
        app.post('/add_account', urlencodedParser, function (req, res) {
            console.log(req.body);

            let newAccount = mydb.collection('accounts').insertOne(req.body, function(err, account){
                if (err) throw err;
                res.redirect('/');
            })
        });

        // edit_delete view
        app.get('/edit_delete', function(req, res){
            mydb.collection('accounts').find({}).toArray(function(err, accounts){
                if (err) throw err;
                // console.log(data); 
                res.render('edit_delete', {
                    accounts: accounts
                });
            });
        });

        // edit view...
        app.get('/edit/:id', function (req, res) {
            // console.log(req.params.id);
            
            ido = new ObjectID(req.params.id);
            
            mydb.collection('accounts').find(ido).toArray(function(err, acc){
                if (err) throw err;
                // console.log(acc);
                res.render('edit', {
                    account: acc
                });
            });
        });

        app.post('/edit/:id', urlencodedParser, function (req, res) {
            console.log(ido);
            
            // edit single account
            let account = {};
            account.name = req.body.name;
            account.deposit = req.body.deposit;
            account.card = req.body.card;

            console.log(account);

            let query = {
                _id: ido
            };
            let newAccount = {$set: {name: account.name, deposit: account.deposit, card: account.card}};
            mydb.collection('accounts').updateOne(query, newAccount, function(err){
                if (err) throw err;
                res.redirect('/');
            });
        });
        // delete account
        app.get('/delete/:id', function (req, res) {
            console.log(req.params.id);
            idd = new ObjectID(req.params.id);
            console.log(idd);
            
            let query = {
                _id: idd
            };
            console.log(query);
            
            mydb.collection('accounts').deleteOne(query, function (err) {
                if (err) throw err;
                res.redirect('/');
            });
        });
    }
});


//listen to port
app.listen(8080);
console.log('You are listening to port 8080!!!');