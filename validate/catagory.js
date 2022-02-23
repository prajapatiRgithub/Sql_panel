const Joi = require('joi');

function categoryValidate(req) {
    const schema = Joi.object({

        categoryName: Joi.string().required().empty().messages({
            "string.base": `Category Name should be a type of 'text'`,
            "string.empty": `Category Name should be an empty field`,
            "any.required": `Category Name is a required field`,
        }),
    })

    const options = {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true,

    };

    return schema.validate(req, options);
}

function idValidate(req) {
    const schema = Joi.object({

        id: Joi.array().empty().required().messages({
            "string.base": `URL should be a type of text`,
            "string.empty":'URL  is not allowed to be empty',
            "string.required": `URL is Required`,
          }),
    })
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };
    return schema.validate(req, options);
}

module.exports = {
    categoryValidate,
    idValidate

}