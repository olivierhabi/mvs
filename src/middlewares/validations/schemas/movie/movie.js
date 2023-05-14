import Joi from "joi";

export default Joi.object()
  .keys({
    movieId: Joi.number().required(),
  })
  .options({ allowUnknown: false });
