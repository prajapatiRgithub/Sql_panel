const bcrypt = require('bcrypt');
const connection = require('../db/db');
const logger = require('../logger/logger');
const { registrationValidate, loginValidate, verifyemailValidate, resetpasswordValidate, updateprofileValidate, verifyEmail } = require('../validate/validation');
const { OTPsend } = require('../middleware/otp');
const jwt = require('jsonwebtoken');
require('../middleware/auth');
const otp = Math.floor((Math.random() * 10000 + 1));
logger.info(otp);

//registration
exports.signup = async (req, res) => {
    try {
        let { error } = registrationValidate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        else {
            const salt = await bcrypt.genSalt(10);
            const encryptedPassword = await bcrypt.hash(req.body.Password, salt);
            const fname = req.body.fname;
            const mname = req.body.mname;
            const lname = req.body.lname;
            const gender = req.body.gender;
            const hobby = req.body.hobby;
            const mobile = req.body.mobile;
            const Image = req.file.filename;
            const city = req.body.city;
            const Email = req.body.Email;
            const Password = encryptedPassword;

            const sql = `INSERT INTO  registration(fname,mname,lname,gender,hobby,mobile,Image,city,Email,Password) VALUES('${fname}','${mname}','${lname}','${gender}','${hobby}','${mobile}','${Image}','${city}','${Email}','${Password}')`;

            connection.query(sql, (err, result) => {
                if (err) {
                    logger.error('Error', err);
                }
                else {
                    console.log("Data Inserted");
                }
            })
        }
    }
    catch (err) {
        logger.error('Error', err);
    }
}
// Login
exports.authUser = async (req, res, next) => {
    console.log(req.body);
    try {
        let { error } = loginValidate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        else {
            var Email = req.body.Email;
            var Password = req.body.Password;

            connection.query(' SELECT * FROM registration WHERE Email = ?', [Email], async function (error, results, fields) {
                if (error) {
                    res.send({
                        "code": 400,
                        "failed": "error ocurred"
                    })
                } else {

                    if (results.length > 0) {
                        const comparision = await bcrypt.compare(Password, results[0].Password)
                        console.log(comparision);
                        if (comparision) {
                            res.send({
                                "code": 200,
                                "success": "login sucessfull"
                            })
                        }
                        else {
                            res.send({
                                "code": 204,
                                "success": "Email and password does not match"
                            })
                        }
                    }
                    else {
                        res.send({
                            "code": 206,
                            "success": "Email does not exits"
                        });
                    }
                }
            });
        }
    }
    catch (err) {
        logger.error('Error', err);
    }
}

exports.forgetPassword = async (req, res) => {
    try {
        const { error } = verifyEmail(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const Email = req.body.Email;
            connection.query('SELECT * FROM registration WHERE Email = ?', [Email], async function (error, result, fields) {
                // console.log(Email);
                console.log(result);
                if (result) {
                    OTPsend(Email, otp);
                    res.send('OTP send');
                }
                else {
                    res.send('user not found')
                }
            })
        }

    } catch (err) {
        logger.error('Error', err);
    }
}

exports.verifyOtp = async (req, res, next) => {
    try {
        if (otp == req.body.otp) {
            res.send('OTP Verify...');
        }
        else {
            res.send('Invalid Otp....')
        }
    } catch (err) {
        logger.error('Error', err);
    }
}

exports.updatePassword = async (req, res) => {
    try {
        const { error } = verifyemailValidate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const Password = req.body.Password;
            console.log(Password);
            const salt = await bcrypt.genSalt(10);
            const bcryptpassword = await bcrypt.hash(Password, salt);
            console.log(bcryptpassword);
            connection.query(`UPDATE registration SET Password = ?`, [bcryptpassword], (err, response) => {

                if (response) {
                    res.send('password updated')
                } else {
                    logger.error('Error', err);
                }
            })
        }
    } catch (err) {
        logger.error('Error', err);
    }
}
//currentpassword --> it means login password  ,, Password it is used in databased ,,
//password --> it it means newpassword 
exports.resetPassword = async (req, res) => {
    console.log(req.body);
    try {
        const { error } = resetpasswordValidate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const  currentpassword = req.body.currentpassword;
            const Email = req.user.Email
            connection.query('SELECT Password FROM registration  WHERE Email=?', [Email], async (err, result) => {
                if (result) {
                    console.log(result[0].Password);
                   const validPassword = await bcrypt.compare( currentpassword, result[0].Password);
                    if (validPassword) {
                        const password = req.body.password;
                        const salt = await bcrypt.genSalt(10);
                        const bcryptpassword = await bcrypt.hash(password, salt);

                        connection.query(`UPDATE registration SET Password = ? WHERE email =?`, [bcryptpassword, Email], (err, response) => {

                            if (response) {
                                res.send('password updated')
                            } else {
                                logger.error('Error', err);
                            }
                        })
                    } else {
                        res.send('password is incorrect')
                    }   } else { logger.error('Error', err); }})}
    } catch (err) {
        logger.error('Error', err);
    }
}

exports.viewProfile = async (req, res) => {
    console.log("dsfsdf");
    const Email = req.user.Email
    console.log("gfhj");
    console.log(Email);
    connection.query(`SELECT * FROM registration WHERE Email=?`, [Email], (err, result) => {
        if (result) {
            console.log(result);
            res.send(result);
        } else {
            logger.error('Error', err);
        }
    })
}

exports.editProfile = async (req, res) => {
    try {
        const { error } = updateprofileValidate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const fname = req.body.fname;
            const mname = req.body.mname;
            const lname = req.body.lname;
            const gender = req.body.gender;
            const hobby = req.body.hobby;
            const mobile = req.body.mobile;
            const Image = req.file.filename;
            const city = req.body.city;
            const Email = req.body.Email;
            console.log(req.user.Email);
            connection.query(`UPDATE registration SET fname='${fname}',mname='${mname}',lname='${lname}',gender='${gender}',hobby='${hobby}',mobile='${mobile}',Image='${Image}',city='${city}',Email='${Email}' WHERE Email ='${req.user.Email}'`, function (err, response) {

                if (response) {
                    res.send('Data updated')
                } else {
                    logger.error('Error', err);
                }
            })
        }
    } catch (err) {

        logger.error('Error', err);
    }
}



exports.logout = async (req, res) => {
    try {
        res.clearCookie("jwt");
        res.send('log out');
    } catch (err) {
        logger.error('Error', err);
    }
};

