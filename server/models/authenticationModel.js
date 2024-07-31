const mongoose = require("mongoose");
const aggrigatePaginate = require("mongoose-aggregate-paginate-v2");

const authenticationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    required: true,
  },
  verification: {
    type: Number,
    required: false,
  },
  link: {
    type: String,
    required: false,
  },
});

authenticationSchema.plugin(aggrigatePaginate);

const Authentication = mongoose.model("Authentication", authenticationSchema);

module.exports = Authentication;
