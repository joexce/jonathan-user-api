'use strict';
const Userdb = require('../model/user.model');
const cache = require('../cache/redis');

const getDataUserDetail = (accountNumber, id) => new Promise((resolve, reject) => {
    cache.get(`user/${accountNumber || id}`, (err, result) => {
        if(result) {
            return resolve({ success: true, data: JSON.parse(result), source: "cache" });
        } else {
            if(id){
                Userdb.findOne({ identityNumber: id }).then((result) => {
                    return resolve(({ success: true, data: result }));
                }).catch((error) => {
                    console.log("Error fetching data ", error);
                    return reject({ success: false });
                });
            } else {
                Userdb.findOne({ accountNumber }).then((result) => {
                    return resolve(({ success: true, data: result }));
                }).catch((error) => {
                    console.log("Error fetching data ", error);
                    return reject({ success: false });
                });
            }
        }
    });
});

const controllers = {

    getUser: (req, res) => {
        Userdb.find().then((result) => {
            return res.json({ success: true, message: 'success get all account', data: result });
        }).catch((error) => {
            console.log("Error fetching data ", error);
            return { success: false };
        });
     },

     getUserByAccountnumber: (req, res) => {

        const accountNumber = req.params.accountNumber;
        const promise = []
        promise.push(getDataUserDetail(accountNumber));

        Promise.all(promise).then((result) => {
            return res.json(result);
        }).catch((error) => {
            console.log("Error fetching data ", error);
            return res.json(error);
        });
     },

     getUserById: (req, res) => {
        const id = req.params.id;
        const promise = []
        promise.push(getDataUserDetail(null, id));

        Promise.all(promise).then((result) => {
            return res.json(result);
        }).catch((error) => {
            console.log("Error fetching data ", error);
            return res.json(error);
        });
     },

    createUser: (req, res) => {

        const { name, userName, accountNumber, emailAddress, identityNumber } = req.body || {};
        const userCreate = new Userdb({
            name, 
            userName,
            accountNumber,
            emailAddress,
            identityNumber
        });

        cache.set(`user/${accountNumber}`, JSON.stringify(req.body));

        userCreate.save().then((result) => {
            return res.json({ success: true, message: 'success create account', data: result });
        }).catch((error) => {
            return { success: false, message: 'errror create data' };
        });
        
        
    },

    updateUser: (req, res) => {
        const { name, userName, accountNumber, emailAddress, identityNumber } = req.body || {};
        Userdb.findOneAndUpdate({ accountNumber }, { 
            name, 
            userName,
            accountNumber,
            emailAddress,
            identityNumber
        }).then((result) => {

            if(result === null){
                return res.json({ success: true, message: 'no need update account number is null', data: result });  
            } else {
                cache.set(`user/${accountNumber}`, JSON.stringify(req.body));
                return res.json({ success: true, message: 'success update account', data: result });
            }
        }).catch((error) => {
            return res.json({ success: false, message: 'failed update account', error });
        });
    },

    deleteUser: (req, res) => {
        const {
            accountNumber
        } = req.body;

        Userdb.findOneAndRemove({ accountNumber }).then((result) => {
            cache.del(`user/${accountNumber}`);
            return res.json({ success: true, message: 'success delete account', data: result });
        }).catch((error) => {
            return res.json({ success: false, message: 'failed delete account', error });
        });
    }
}

module.exports = controllers;