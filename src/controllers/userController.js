const db = require("../../database/models/index");
const crypto = require("crypto");

function edit (req, res){

    try {
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
                    id: req.decoded.id
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
              id: req.decoded.id
            }
        })
        res.send('User are updated.');
    }

    catch(err) {
        console.log(err);
    }
}

async function delet (req, res){

    try {
        const user = await db.sequelize.models.User.destroy({
            where: {
              id: req.decoded.id
            }
        })
        if (user !== null) {res.send('User is deleted.')}
        else {res.send('User is not found.')}
    }
    
    catch(err) {
        console.log(err);
    }
}

module.exports = {

    edit,

    delet
}