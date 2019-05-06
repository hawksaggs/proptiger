const db = require('../helper/db');
// console.log(db);
module.exports = {
    execute: (req, res) => {
        // console.log(req.body);
        if(!req.body) {
            return res.status(400).send({
                error:true,
                message:'Parameter requried'
            });
        }
        if (req.body.query.includes("delete") || req.body.query.includes("update") || req.body.query.includes("insert" )) {
            return res.status(400).send({
                error:true,
                message:'You are not authorized'
            });
        }

        db.query(req.body.query, function(error, results, fields){
            if(error) {
                return res.status(400).send({
                    error:true,
                    message:error.message
                }); 
            }
            // console.log(fields);
            // console.log(results);
            return res.status(200).send({
                error:false,
                data: results
            });
        });
    }


}