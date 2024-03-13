module.exports = (sequelize, Sequelize) => {
    const Messages = sequelize.define(
        'messages',
        {
            sender_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            receiver_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            message: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            sent_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            is_delete: {
                type: Sequelize.BOOLEAN,
                defaultValue: "0",
                comment: "0 = false, 1 = true",
            },
            is_testdata: {
                type: Sequelize.BOOLEAN,
                defaultValue: "1",
                comment: "0 = false, 1 = true",
            },
        },
        { freezeTableName: true, timestamps: true, createdAt: "created_at", updatedAt: "updated_at" },
    );
    return Messages;
}
