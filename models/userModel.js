import mongoose from "mongoose";
//import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

const UserModel = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  birthdate: { type: String, required: true },
  type: { type: Number, required: true }, // 0 - user; 1 - admin; 2 - main admin
  social: { type: String, required: false },
  avatar: { type: String, required: true, }
});
//
// UserModel.pre("save", function (next) {
//   const user = this;
//   if (this.isModified("password") || this.isNew) {
//     bcrypt.genSalt(10, (err, salt) => {
//       if (err) {
//         return next(err);
//       }
//       bcrypt.hash(user.password, salt, (error, hash) => {
//         if (error) {
//           return next(error);
//         }
//         user.password = hash;
//         next();
//       });
//     });
//   } else {
//     return next();
//   }
// });

// // Create method to compare password input to password saved in database
// UserModel.methods.comparePassword = function (pw, cb) {
//   bcrypt.compare(pw, this.password, (err, isMatch) => {
//     if (err) {
//       return cb(err);
//     }
//     cb(null, isMatch);
//   });
// };

const User = mongoose.model("User", UserModel, "users");
export default User;
