const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    image: Joi.object({
      url: Joi.string().uri().allow('').default("https://i.pinimg.com/736x/53/e0/a1/53e0a1efcd011d97fc5f728b1b6093cb.jpg"),
      filename: Joi.string().allow('')
    }).default()
  }).required()
});


module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),
    }).required(),
});