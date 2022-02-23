const connection = require('../db/db');
const {categoryValidate,idValidate} = require('../validate/catagory');
const { logger } = require('../logger/logger');

exports.addData = async (req, res) => {
  
    try {
       
        const { error } = categoryValidate(req.body);
       
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const categoryName = req.body.categoryName;
            const sql = `INSERT INTO category (categoryName) VALUES ('${categoryName}')`;
            connection.query(sql, (err, result) => {
                if (err) {
                    logger.error('Error', err);
                } else {
                    res.send("Data Inserted...")
                }
            })
        }
    } catch (err) {
        logger.error('Error', err);
    }

}

exports.findData = async (req, res) => {
    let sql = `SELECT * FROM category`
    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error', err);
        } else {
            res.send(result)
        }
    })
}

exports.findcategory_id = async (req, res) => {
    const id = req.params.id;
    let sql = `SELECT * FROM category WHERE id =${id}`
    connection.query(sql, (err, result) => {
        if (err) {
            logger.error('Error', err);
        } else {
            res.send(result)
        }
    })
}

exports.editcategory = async (req, res) => {
    try {
        const { error } = categoryValidate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const id = req.params.id;
            const categoryName = req.body.categoryName;
            let sql = `UPDATE category SET categoryName='${categoryName}'  WHERE id =${id}`;
            connection.query(sql, (err, result) => {
                if (err) {
                    logger.error('Error', err);
                } else {
                    res.send("data update")
                }
            })
        }
    } catch (err) {
        console.error('Error', err);
    }
}

exports.deleteData = async (req, res) => {
    const id = req.params.id;
    console.log(id);
    let sql = `DELETE FROM category WHERE id=${id}`
    connection.query(sql, (err, result) => {
        if (err) {
            logger.error('Error', err);
        } else {
            res.send("data deleted")
        }
    })
}

exports.multipleDelete = async (req, res) => {
    try {
        let { error } = idValidate(req.body);
        console.log(error);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const id = req.body.id;
            connection.query("DELETE FROM category WHERE id IN ('" + id.join("','") + "') ", (err, response) => {
                if (response) {
                    res.send("Selected Category Deleted...");
                } else {
                    res.send('Selected Category Not Deleted!.....');
                }
            });
        }
    } catch (err) {
        logger.error("err", err);
        res.send(err);
    }
};