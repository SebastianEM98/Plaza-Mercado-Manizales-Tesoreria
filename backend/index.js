const mongoose = require("mongoose");
const app = require('./app');
const { USERNAME, PASSWORD } = require('./config');

// dotenv configuration
require('dotenv').config();

const PORT_SERVER = process.env.PORT || 5000;
const DB_NAME = process.env.DB_NAME;

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb+srv://${USERNAME}:${PASSWORD}@database-cluster.4aiaqho.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`)
    .then(() => {
        console.log("****** Conexion a la base de datos establecida con exito ******");

        // Server creation
        app.listen(PORT_SERVER, () => {
            console.log(`######## Servidor corriendo correctamente por el puerto: ${PORT_SERVER} ########`);
        });
    })
    .catch(err => console.log(err));