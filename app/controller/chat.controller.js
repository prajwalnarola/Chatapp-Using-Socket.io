const { Op, Sequelize, where } = require("sequelize");
const db = require("../config/db.config");
const { users, messages } = db;

async function createMessage(param) {
    try {
        const senderIdData = await users.findAll({
            where: { id: param.senderId, is_delete: 0, is_testdata: 1 },
        });

        if (senderIdData.length > 0) {

            const recieverIdData = await users.findAll({
                where: { id: param.recipientId, is_delete: 0, is_testdata: 1 },
            });

            if (recieverIdData.length > 0) {

                const newMessage = await messages.create({
                    sender_id: param.senderId,
                    receiver_id: param.recipientId,
                    message: param.message
                });
                console.log('Message stored successfully:', newMessage);
                return newMessage;

            } else {
                console.error('Reciever not found');
                return
            }
        } else {
            console.error('Sender not found');
            return
        }

    } catch (error) {
        console.error('Error storing message:', error);
        throw error;
    }
}

async function getPreviousConversations(param) {
    try {
        const conversations = await messages.findAll({
            where: {
                [Op.or]: [
                    { sender_id: param.senderId, receiver_id: param.recipientId },
                    { sender_id: param.recipientId, receiver_id: param.senderId }
                ]
            },
            attributes: { exclude: ["created_at", "updated_at", "is_testdata", "is_delete"] },
            include: [
                {
                  model: db.users,
                  as: "sender_user",
                  attributes: ["id", "name", "email"],
                },
                {
                    model: db.users,
                    as: "reciever_user",
                    attributes: ["id", "name", "email"],
                  },
              ],
            order: [['sent_at', 'ASC']]
        });

        let response = {
            status: "Success",
            data: conversations ?? [],
          };
        return response

    } catch (error) {
        console.error('Error retrieving previous conversations:', error);
        return
    }
}

module.exports = {
    createMessage,
    getPreviousConversations
};
