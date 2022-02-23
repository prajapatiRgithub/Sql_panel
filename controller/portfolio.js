const connection = require('../db/db');
const { portfolioValidate,idValidate } = require('../validate/portfolio');
const { logger } = require('../logger/logger');

exports.addData = async (req, res) => {
    try {
        const { error } = portfolioValidate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const result = req.files.map(images => images.filename);
            const categoryName = req.body.categoryName;
            const pname = req.body.pname;
            const uploadImage = result;
            const ptitle = req.body.ptitle;
            const url = req.body.url;
            const pdate = req.body.pdate;

            connection.query(`SELECT id FROM category where categoryName='${categoryName}'`, function (err, result) {
                console.log(result);
                const category_id = result[0].id;
                const sql = `INSERT INTO portfolio (category_id,pname,uploadImage,ptitle,url,pdate) VALUES('${category_id}','${pname}','${uploadImage}','${ptitle}','${url}','${pdate}')`;
                connection.query(sql, (err, result) => {
                    if (err) {
                        logger.error('Error', err);
                    } else {
                        res.send("Data Inserted...")
                    }
                })
            })
        }
    } catch (err) {
        logger.error('Error', err);
    }
}

exports.findData = async (req, res) => {
    connection.query(`SELECT portfolio.category_id,category.id,category.categoryName FROM portfolio JOIN category ON  portfolio.category_id = portfolio.category_id`, (err, result) => {

        if (result) {
            console.log(result);
            let sql = `SELECT * FROM portfolio`
            connection.query(sql, (err, result) => {
                if (err) {
                    logger.error('Error', err);
                } else {
                    res.send(result)
                }
            })
        }
        else {
            res.send('Category not found')
        }
        logger.error(err)
    });
}
exports.findDataByid = async (req, res) => {
    const id = req.params.id;
    let sql = `SELECT * FROM portfolio WHERE id =${id}`
    connection.query(sql, (err, result) => {
        if (result) {
            res.send(result)
        } else {
            res.send("Invalid ID")
        }
    })
}

exports.editportfolio = async (req, res) => {

    try {
        const { error } = portfolioValidate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const id = req.params.id;
            console.log(id);

            const result = req.files.map(images => images.filename);
            const categoryName = req.body.categoryName;
            const pname = req.body.pname;
            const uploadImage = result;
            const ptitle = req.body.ptitle;
            const url = req.body.url;
            const pdate = req.body.pdate;

            console.log(uploadImage);
            connection.query(`SELECT id FROM category where categoryName='${categoryName}'`, function (err, result) {
                const category_id = result[0].id;
                connection.query(`UPDATE portfolio SET category_id='${category_id}', pname='${pname}', uploadImage='${uploadImage}', ptitle='${ptitle}', url = '${url}',pdate='${pdate}' WHERE id ='${id}'`, function (err, response) {

                    if (response) {
                        res.send('Data updated')
                    } else {
                        logger.error('Error', err);
                    }
                })

            })

            connection.query(`UPDATE portfolio SET pname='${pname}', uploadImage='${uploadImage}', ptitle='${ptitle}', url = '${url}',pdate='${pdate}' WHERE id ='${id}'`, function (err, response) {

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

exports.deleteData = async (req, res) => {
    const id = req.params.id;
    let sql = `DELETE FROM portfolio WHERE id=${id}`
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
            connection.query("DELETE FROM portfolio WHERE id IN ('" + id.join("','") + "') ", (err, response) => {
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


