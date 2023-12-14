module.exports = function(app, shopData) {

    const redirectLogin = (req, res, next) => {
        if (!req.session.userId ) {
          res.redirect('./login')
        } else { next (); }
    }
    const { check, validationResult } = require('express-validator');


    // Handle our routes
    app.get('/',function(req,res){
        res.render('index.ejs', shopData)
    });
    app.get('/about',function(req,res){
        res.render('about.ejs', shopData);
    });
    app.get('/search',function(req,res){
        res.render("search.ejs", shopData);
    });
    app.get('/search-result', function (req, res) {
        //searching in the database
        //res.send("You searched for: " + req.query.keyword);

        let sqlquery = "SELECT * FROM books WHERE name LIKE '%" + req.query.keyword + "%'"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, shopData, {availableBooks:result});
            console.log(newData)
            res.render("list.ejs", newData)
         });        
    });
    app.get('/register', function (req,res) {
        res.render('register.ejs', shopData);                                                                     
    });                                                                                                 
    app.post('/registered', [check('email').isEmail()], [check('password').isLength({ min: 8 })], function (req, res) {
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            // Redirect if there are validation errors
            res.redirect('./register');
        } else {
            // Continue processing if there are no validation errors
    
            // Saving data in the database
            const bcrypt = require('bcrypt');
            const saltRounds = 10;
            const plainPassword = req.body.password;
    
            bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
                // Handle bcrypt hashing and database insertion
    
                let sqlquery = "INSERT INTO userlogin (username, firstname, lastname, email, hashedPassword) VALUES (?,?,?,?,?)";
                let newrecord = [req.sanitize(req.body.first), req.sanitize(req.body.username), req.sanitize(req.body.first), req.sanitize(req.body.first), req.sanitize(req.body.last), req.sanitize(req.body.email), hashedPassword];
    
                db.query(sqlquery, newrecord, (err, result) => {
                    if (err) {
                        // Handle database error
                        return console.error(err.message);
                    } else {
                        // Send response once after successful database insertion
                        res.send('Hello ' + req.sanitize(req.body.first) + ' ' + req.sanitize(req.body.last) + ' you are now registered! We will send an email to you at ' + req.sanitize(req.body.email));
                    }
                });
            });
        // saving data in database
        res.send(' Hello '+ req.sanitize(req.body.first) + ' '+ req.sanitize(req.body.last) +' you are now registered!  We will send an email to you at ' + req.sanitize(req.body.email));    
    };                                                                          
    });
    
    app.get('/listusers', function(req, res) {
        
        // Query database to get all the users
        let sqlquery = "SELECT * FROM userlogin";

        // Execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./');
            }
            let newData = Object.assign({}, shopData, {listoutput:result});
            console.log(newData)
            res.render("listusers.ejs", newData)
         });
        });

    app.get('/list', function(req, res) {
        let sqlquery = "SELECT * FROM books"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, shopData, {availableBooks:result});
            console.log(newData)
            res.render("list.ejs", newData)
         });
    });


    app.get('/loggedin', function (req,res) {
        res.render('loggedin.ejs', shopData);
        }); 
    app.post('/loggedin', function(req, res) {
        const username = req.body.username;
        const password = req.body.password;
    
        // Check the username and password against the database
        let sqlquery = "SELECT * FROM userlogin WHERE username = ?";
        db.query(sqlquery, [username], (err, result) => {
            if (err) {
                console.error(err.message);
                res.redirect('./login');
            }
    
            if (result.length > 0) {
                // User found, check password
                const hashedPasswordFromDB = result[0].hashedPassword;
    
                const bcrypt = require('bcrypt');
                bcrypt.compare(password, hashedPasswordFromDB, function(err, passwordMatch) {
                    if (passwordMatch) {
                        req.session.userId = req.body.username;
                        // Passwords match, consider the user as logged in
                        res.render('loggedin.ejs', { message: 'Login successful! Welcome,  ' + username })
                        ;
                    } else {
                        res.render('loggedin.ejs', { message: 'Login failed. Invalid password for user: ' + username });
                    }
                });
            } else {
                // User not found
                res.render('loggedin.ejs', { message: 'Login failed. User not found: ' + username });
            }
        });
    });

    app.get('/login', function (req,res) {
        res.render('login.ejs', shopData);
        }); 

        app.post('/login', function(req, res) {
            const username = req.body.username;
            const password = req.body.password;
        
            // Check the username and password against the database
            let sqlquery = "SELECT * FROM userlogin WHERE username = ?";
            db.query(sqlquery, [username], (err, result) => {
                if (err) {
                    console.error(err.message);
            
                }
        
                if (result.length > 0) {
                    // User found, check password
                    const hashedPasswordFromDB = result[0].hashedPassword;
        
                    const bcrypt = require('bcrypt');
                    bcrypt.compare(password, hashedPasswordFromDB, function(err, passwordMatch) {
                        if (passwordMatch) {
                            // Passwords match, consider the user as logged in
                            res.send('Login successful for user: ' + (req.body.username)+'<a href='+'./'+'>Home</a>') ;
                        } else {
                            res.send('Invalid password');
                        }
                    });
                } else {
                    // User not found
                    res.send('User not found');
                }
            });
        });

        app.get('/logout', (req, res) => {
            req.session.destroy(err => {
                if (err) {
                    console.error(err.message);
                    return res.redirect('./');
                }
                res.send('you have been logged out. <a href='+'./'+'>Home</a>');
            });
        });
    

    app.get('/addgame', function (req, res) {
        res.render('addgame.ejs', shopData);
     });
 
     app.post('/gameadded', function (req,res) {
           // saving data in database
           let sqlquery = "INSERT INTO forums (name, price, description, rating) VALUES (?,?,?,?)";
           // execute sql query
           let newrecord = [req.sanitize(req.body.name), req.sanitize(req.body.price),req.sanitize(req.body.description),req.sanitize(req.body.rating)];
           db.query(sqlquery, newrecord, (err, result) => {
             if (err) {
               return console.error(err.message);
             }
             else
             res.send(' This game is added to database, name: '+ req.sanitize(req.body.name) + ' price '+ req.sanitize(req.body.price));
             });
       });    
                            
       app.get('/bargainbooks', function(req, res) {
        let sqlquery = "SELECT * FROM books WHERE price < 20";
        db.query(sqlquery, (err, result) => {
          if (err) {
             res.redirect('./');
          }
          let newData = Object.assign({}, shopData, {availableBooks:result});
          console.log(newData)
          res.render("bargains.ejs", newData)
        });
    });   

    app.get('/gamelistapi', function(req, res) {
        const https = require('https');
    
        const options = {
            method: 'GET',
            hostname: 'free-to-play-games-database.p.rapidapi.com',
            port: null,
            path: '/api/games',
            headers: {
                'X-RapidAPI-Key': '19c76a47b4msh6c33ede5e9be8fdp11e111jsnc1e6e238791e',
                'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com'
            }
        };
    
        const requestObject = https.request(options, function (apiResponse) {
            const chunks = [];
    
            apiResponse.on('data', function (chunk) {
                chunks.push(chunk);
            });
    
            apiResponse.on('end', function () {
                const body = Buffer.concat(chunks);
                const gameListData = JSON.parse(body.toString());
    
                // Handle the gameListData as needed, for example, render a view
                res.render('gamelistapi', { data: gameListData });
            });
        });
    
        requestObject.end();
    });
}

