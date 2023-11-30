const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../../config');


var userController = {

    loginUser: async function (req, res) {

        const { email, password } = req.body;

        try {

            const user = await User.findOne({ email: email });

            if (!user) {
                return res.status(404).send({ message: "El correo electrónico o la contraseña son incorrectos" });
            }

            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return res.status(400).send({ message: "El correo electrónico o la contraseña son incorrectos" });
            }

            const token = jwt.sign({
                email: email
            }, JWT_SECRET_KEY, {
                expiresIn: "420m"
            });

            return res.status(200).send({
                message: "Login correcto",
                token: token
            });

        } catch (err) {
            return res.status(500).send({ message: "Ha ocurrido un error al iniciar sesión" });
        }
    },


    createUser: async function (req, res) {
        const user = new User();

        const { name, email, role, password, repeatPassword } = req.body;

        user.name = name;
        user.email = email;
        user.role = role;

        if (!password || !repeatPassword) {
            return res.status(400).send({ message: "Las contraseñas son obligatorias" });
        } else {
            if (password !== repeatPassword) {
                return res.status(400).send({ message: "Las contraseñas no coinciden" });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                user.password = hashedPassword;
            }
        }

        user.save().then((createdUser) => {

            if (!createdUser) {
                return res.status(404).send({ message: "Error al crear el usuario" });
            }

            return res.status(200).send({
                message: "Usuario creado exitosamente",
                user: createdUser
            });

        }).catch((err) => {
            return res.status(500).send({ message: `El usuario ${user.email} ya existe` });
        });
    },


    getUser: async function (req, res) {
        const userId = req.params.id

        try {
            const user = await User.findById(userId).select('_id name email role');

            if (!user) {
                return res.status(404).send({ message: "El usuario no existe" });
            }

            return res.status(200).send({ user });

        } catch (err) {
            return res.status(500).send({ message: "El usuario no existe" });
        }
    },


    getUserByOwner: async function (req, res) {
        const userToken = req.params.token
        const tokenDecoded = jwt.decode(userToken, JWT_SECRET_KEY, true);

        try {
            const user = await User.findOne({ email: tokenDecoded.email }).select('_id name email role');

            if (!user) {
                return res.status(404).send({ message: "El usuario no existe" });
            }

            return res.status(200).send({ user });

        } catch (err) {
            return res.status(500).send({ message: "Error al mostrar los datos del usuario" });
        }
    },


    getUsers: async function (req, res) {

        try {
            const users = await User.find().select('_id name email role');;

            if (!users) {
                return res.status(404).send({ message: "No hay usuarios por mostrar" });
            }

            return res.status(200).send({ users });

        } catch (err) {
            return res.status(500).send({ message: "Error al mostrar los usuarios" });
        }
    },


    updateUser: async function (req, res) {
        const userId = req.params.id;
        const { name, email, role } = req.body;

        var user = {
            name: name,
            email: email,
            role: role
        }

        try {
            const existingUserEmail = await User.findOne({ email: email, _id: { $ne: userId } });

            if (existingUserEmail) {
                return res.status(400).send({ message: "El correo electrónico ya está en uso por otro usuario" });
            }

            const updatedUser = await User.findByIdAndUpdate(userId, user, { new: true });

            if (!updatedUser) {
                return res.status(404).send({ message: "El usuario a modificar no existe" });
            }

            return res.status(200).send({ message: "Usuario actualizado", user: updatedUser });

        } catch (err) {
            return res.status(500).send({ message: "Error al actualizar el usuario", error: err });
        }
    },

    
    updateUserByOwner: async function (req, res) {
        const userId = req.params.id;
        const { name, email, role } = req.body;

        var user = {
            name: name,
            email: email,
            role: role
        }

        try {
            const existingUserEmail = await User.findOne({ email: email, _id: { $ne: userId } });

            if (existingUserEmail) {
                return res.status(400).send({ message: "El correo electrónico ya está en uso por otro usuario" });
            }

            const updatedUser = await User.findByIdAndUpdate(userId, user, { new: true });

            if (!updatedUser) {
                return res.status(404).send({ message: "El usuario a modificar no existe" });
            }

            const token = jwt.sign({
                email: updatedUser.email
            }, JWT_SECRET_KEY, {
                expiresIn: "420m"
            });

            return res.status(200).send({ message: "Información de la cuenta actualizada", token: token });

        } catch (err) {
            return res.status(500).send({ message: "Error al actualizar la información de la cuenta", error: err });
        }
    },


    changeUserPassword: async function (req, res) {
        const userId = req.params.id;
        const { oldPassword, newPassword, repeatNewPassword } = req.body;

        var user = {
            password: ""
        }

        if (!newPassword || !repeatNewPassword) {
            return res.status(400).send({ message: "Las contraseñas son obligatorias" });
        } else {
            if (newPassword !== repeatNewPassword) {
                return res.status(400).send({ message: "Las contraseñas no coinciden" });
            } else {
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                user.password = hashedPassword;
            }
        }

        try {
            const oldUser = await User.findById(userId);

            if (!oldUser) {
                return res.status(404).send({ message: "El usuario a modificar no existe" });
            }

            const validOldPassword = await bcrypt.compare(oldPassword, oldUser.password);

            if (!validOldPassword) {
                return res.status(400).send({ message: "La contraseña actual es incorrecta" });
            }

            const updatedUser = await User.findByIdAndUpdate(userId, user, { new: true });

            if (!updatedUser) {
                return res.status(404).send({ message: "El usuario a modificar no existe" });
            }

            return res.status(200).send({ message: "Contraseña actualizada", user: updatedUser });

        } catch (err) {
            return res.status(500).send({ message: "Error al actualizar la contraseña", error: err });
        }
    },


    deleteUser: async function (req, res) {
        const userId = req.params.id;

        try {
            const userRemoved = await User.findByIdAndRemove(userId);

            if (!userRemoved) {
                return res.status(404).send({ message: "El usuario a eliminar no existe" });
            }

            return res.status(200).send({ message: `El usuario "${userRemoved.name}" ha sido eliminado`, userRemoved });

        } catch (err) {
            return res.status(500).send({ message: "Error al eliminar el usuario" });
        }
    }

};

module.exports = userController;