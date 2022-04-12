const db = require("../../database/models/index");
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const tokenKey = '1c2b-3c4d-5a6f-4g8h';

async function registration (req, res) {
    try {
        const symbolArr = ['1','2','3','4','5', '6', '7', '8', '9', '-', '_', '!', '?', ',', '.', '$', '%', '+', '=', '/', '|', '@', '#', '№'];
        let numberOfSpace = 0;
        for(let letter of req.body.fullName) {
            if(isNaN(Number(letter)) === false && letter !== ' ') {
                return res.send('Enter first and last name.');
            }

            if(symbolArr.indexOf(letter) !== -1) {
                return res.send('Enter first and last name.');
            }
            
            if(letter === ' ') {
                numberOfSpace +=1;
            }
        }
        if(numberOfSpace === 0) {return res.send('Enter first and last name.');}

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
            return res.send('Сancel. Password must have at least one capital letter, one symbol from (- _ + = ! ? % / | @ # $ № . ,) or one number, and its length must be at least 6.');
        }

        const users0 = await db.sequelize.models.User.create({
            fullName: req.body.fullName,
            dob: req.body.dob,
            email: req.body.email,
            password: crypto
            .createHmac('sha256', 'salt')
            .update(req.body.password)
            .digest('hex')
        });
        const user = {
            id: users0.id,
            fullName: users0.fullName,
            dob: users0.dob,
            email: users0.email,
            createdAt: users0.createdAt,
            updatedAt: users0.updatedAt,
            token: jwt.sign({ id: users0.id }, tokenKey, { expiresIn: 60 * 60 }),
        };
        res.send(user);
    } catch(err) {
        console.log (err);
    }
}

async function authorization (req, res){
    try {
        const user0 = await db.sequelize.models.User.findOne({
            where: {
                fullName: req.body.fullName,
                password: crypto
                .createHmac('sha256', 'salt')
                .update(req.body.password)
                .digest('hex')
            }
        });
        if(user0 !==null) {
            const user = {
                id: user0.id,
                fullName: user0.fullName,
                dob: user0.dob,
                email: user0.email,
                createdAt: user0.createdAt,
                updatedAt: user0.updatedAt,
                token: jwt.sign({ id: user0.id }, tokenKey, { expiresIn: 60 * 60 }),
            };
            res.send(user);
        } else {res.status(401).send("Wrong full Name or password.")}
    } catch(err) {
        console.log (err);
    }
}

function authorizationByToken (req, res) {
    try{
        const id = req.decoded.id;
        const getUser = async () => {
            const user0 = await db.sequelize.models.User.findByPk(id);
            const user = {
                id: user0.id,
                fullName: user0.fullName,
                dob: user0.dob,
                email: user0.email,
                createdAt: user0.createdAt,
                updatedAt: user0.updatedAt
            };
            res.send(user);
        };
        return getUser();
    } catch(err) {
        console.log (err);
        res.send('Log in.');
    }
}

module.exports = {
    registration,
    authorization,
    authorizationByToken,
}