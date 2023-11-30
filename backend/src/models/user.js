const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true
    },
    role: {
        type: String,
        require: true,
        enum: {
            values: ["ADMINISTRADOR", "TESORERO", "SUPERVISOR"],
            message: "Rol no valido"
        }
    },
    password: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model("User", UserSchema);