import Joi from "joi";

export default Joi.object()
  .keys({
    movieId: Joi.number().optional(),
    rank: Joi.number().optional(),
  })
  .options({ allowUnknown: false });
