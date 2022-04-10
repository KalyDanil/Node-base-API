const express = require("express");
const Sequelize = require("sequelize");
const db = require("../models/index");
const app = express();
const urlencodedParser = express.urlencoded({extended: true});
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const tokenKey = '1c2b-3c4d-5a6f-4g8h';

app.post("/", urlencodedParser, function(req, res){
    
    let numberOfPoint = 0;
    for(let letter of req.body.dob) {
        if(isNaN(Number(letter)) === true && letter !== ".") {
            return res.send('Enter birthday in the format "day.month.year" by numbers.');
        }
        
        if(letter === '.') {
            numberOfPoint +=1;
        }
    }
    if(numberOfPoint < 2) {
        return res.send('Enter birthday in the format "day.month.year" by numbers.');
    }
   
    const mailDogIndex = req.body.email.indexOf('@');
    const mailPointIndex = req.body.email.indexOf('.');
    if(mailDogIndex === -1 || mailPointIndex === -1) {
        return res.send('Such emails are not exist.');
    }

    const passwordLen = req.body.password.length;
    const symbolArr = ['1','2','3','4','5', '6', '7', '8', '9', '-', '_', '!', '?', '$', '%', '+', '=', '/', '|', '@', '#', '№'];
    let numberOfSymbol = 0;
    let numberOfCapitalLetter = 0;
    for (let letter of req.body.password) {

        if(symbolArr.indexOf(letter) !== -1) {
            numberOfSymbol +=1;
        }

        if(letter.toUpperCase() === letter) {
            numberOfCapitalLetter += 1;
        }
    }
    if(passwordLen < 6 || numberOfSymbol === 0 || numberOfCapitalLetter === 0) {
        return res.send('Сancel. Password must have at least one capital letter, one symbol from (-, _, +, =, !, ?, %, /, |, @, #, $, №) or one number, and its length must be at least 6.');
    }

    db.sequelize.models.User.create({
        fullName: req.body.fullName,
        dob: req.body.dob,
        email: req.body.email,
        password: crypto
        .createHmac('sha256', 'salt')
        .update(req.body.password)
        .digest('hex')
    });
    res.send('You have successfully registered,'+' '+ req.body.fullName + '.');
});

app.get("/", urlencodedParser, async function(req, res){
    const user = await db.sequelize.models.User.findOne({
        where: {
            fullName: req.body.fullName,
            password: crypto
            .createHmac('sha256', 'salt')
            .update(req.body.password)
            .digest('hex')
        }
    });
    if (user !== null) {
        res.json({
            id: user.id,
            token: jwt.sign({ id: user.id }, tokenKey, { expiresIn: 60 * 60 }),
          });
    }
    else {res.status(401).send("Wrong full Name or password.")}
});

app.use((req, res, next) => {
    jwt.verify(
    req.headers.authorization.split(' ')[1],
    tokenKey,
    (err) => {
        if (err) {res.send("Log in.")}
        else {next()}
    }
    )
})

app.put("/", urlencodedParser, function(req, res){

    if (req.body.dob !== undefined) {
        let numberOfPoint = 0;

        for(let letter of req.body.dob) {
            if(isNaN(Number(letter)) === true && letter !== ".") {
                return res.send('Enter birthday in the format "day.month.year" by numbers.');
            }
            
            if(letter === '.') {
                numberOfPoint +=1;
            }
        }

        if(numberOfPoint < 2) {
            return res.send('Enter birthday in the format "day.month.year" by numbers.');
        }
    }
   
    
    if(req.body.email !== undefined) {
        const mailDogIndex = req.body.email.indexOf('@');
        const mailPointIndex = req.body.email.indexOf('.');

        if(mailDogIndex === -1 || mailPointIndex === -1) {
            return res.send('Such emails are not exist.');
        }
    }
    
    if(req.body.password !== undefined) {
        const passwordLen = req.body.password.length;
        const symbolArr = ['1','2','3','4','5', '6', '7', '8', '9', '-', '_', '!', '?', '$', '%', '+', '=', '/', '|', '@', '#', '№'];
        let numberOfSymbol = 0;
        let numberOfCapitalLetter = 0;

        for (let letter of req.body.password) {

            if(symbolArr.indexOf(letter) !== -1) {
                numberOfSymbol +=1;
            }
    
            if(letter.toUpperCase() === letter) {
                numberOfCapitalLetter += 1;
            }
        }

        if(passwordLen < 6 || numberOfSymbol === 0 || numberOfCapitalLetter === 0) {
            return res.send('Сancel. Password must have at least one capital letter, one symbol from (-, _, +, =, !, ?, %, /, |, @, #, $, №) or one number, and its length must be at least 6.');
        }
            
        db.sequelize.models.User.update({ 
            fullName: req.body.fullName,
            dob: req.body.dob,
            email: req.body.email,
            password: crypto
            .createHmac('sha256', 'salt')
            .update(req.body.password)
            .digest('hex')
         }, {
            where: {
              id: jwt.decode( req.headers.authorization.split(' ')[1]).id
            }
        })
        return res.send('User are updated.');
    }    

    db.sequelize.models.User.update({ 
        fullName: req.body.fullName,
        dob: req.body.dob,
        email: req.body.email
     }, {
        where: {
          id: jwt.decode( req.headers.authorization.split(' ')[1]).id
        }
    })
    res.send('User are updated.');
});

app.delete("/", async function(req, res){
    const user = await db.sequelize.models.User.destroy({
        where: {
          id: jwt.decode( req.headers.authorization.split(' ')[1]).id
        }
    })
    if (user !== null) {res.send('User is deleted.')}
    else {res.send('User is not found.')}
});

app.listen(3000);