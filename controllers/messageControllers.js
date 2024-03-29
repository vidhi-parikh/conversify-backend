const Message = require('./../models/messageModel');
const User = require('./../models/userModel');
const Chat = require('./../models/chatModel');
const sendMessage = async(req,res) => {
    const { content,chatId } = req.body;

    if(!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: req.userId,
        content: content,
        chat: chatId,
    };


    try {
        let message = await Message.create(newMessage);
        message = await message.populate("sender","firstName");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "firstName email"
        });


        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        });

        res.json(message);
    }
    catch(error) {
        res.status(400);
        throw new Error(error);
    }
}

const allMessages = async(req,res) => {
    try {
      const messages = await Message.find({chat: req.params.chatId})
      .populate("sender","firstName email")
      .populate("chat");

      res.json(messages);
    }
    catch(error) {
        res.status(400);
        throw new Error(error.message)
    }
}

module.exports = { sendMessage, allMessages };