require("dotenv").config();
const Sequelize = require("sequelize");
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = ""

const sequelize = new Sequelize(dbName, dbUser, dbPassword,{
    port: process.env.PORT,
    host: process.env.DB_HOST,
    dialect: "mysql"
});

const db = {}

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = require("../model/user.model")(sequelize, Sequelize);
db.deviceToken = require("../model/device_token.model")(sequelize, Sequelize);
db.messages = require("../model/messages.model")(sequelize, Sequelize);

// has RELATIONS (HasMany / HasOne)
db.users.hasOne(db.deviceToken, { as: "devicetoken", foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.users.hasMany(db.messages, { as: "sender_messages", foreignKey: "sender_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.users.hasMany(db.messages, { as: "reciever_messages", foreignKey: "receiver_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });

// belongsTO RELATION (BelongsTo / BelongsToMany)(foreign-key)
db.deviceToken.belongsTo(db.users, { as: "user", foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.messages.belongsTo(db.users, { as: "sender_user", foreignKey: "sender_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });
db.messages.belongsTo(db.users, { as: "reciever_user", foreignKey: "receiver_id", targetKey: "id", onDelete: "CASCADE", onUpdate: "NO ACTION" });

module.exports = db