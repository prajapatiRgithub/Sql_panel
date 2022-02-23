const mysql =require('mysql');
const logger = require('../logger/logger');

var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:"sql_panel"
})

connection.connect((err)=>{
    if(err){
        logger.error('Error,err');
    }else{
        console.log('Database connected....');
    }
});

module.exports = connection;