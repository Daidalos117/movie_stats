var mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ],
    trakt: {
      id: { type: String, required: true },
      status: { type: Boolean, required: true, default: 1 },
      access_token: { type: String, required: true },
      refresh_token: { type: String, required: true },
      vip: { type: Boolean, required: false }
    }
  },
  { timestamps: true }
);

UserSchema.methods.generateAuthToken = async function() {
  // Generate an auth token for the user
  const user = this;
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  try {
		await user.save();
  } catch (e) {

	}
  return token;
};

module.exports = mongoose.model('User', UserSchema);
