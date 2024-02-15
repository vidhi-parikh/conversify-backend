const Chat = require("../models/chatModel")
const User = require("../models/userModel")

const accessChat = async(req,res) => {
    const { userId } = req.body;
    console.log('userId',userId)
    
    if(!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }

    let isChat = await Chat.find({
        $and: [
            {users:{$elemMatch: {$eq: req.userId}}},
            {users: {$elemMatch: {$eq: userId}}},
        ],
    })
    .populate("users","-password")
    .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path:"latestMessage.sender",  
        select:"firstName lastName email",
    });

    if(isChat.length > 0) {
        res.send(isChat[0]);
    }
    else {
        let chatData = {
            chatName: "sender",
            users:[req.userId,userId],
        }

        try{
            console.log('check1')
            const createdChat = await Chat.create(chatData);
            console.log('check2')
            const FullChat = await Chat.findOne({_id:createdChat._id}).populate("users","-password")
            res.status(200).json(FullChat);
        }
        catch(error) {
            res.status(400).send('Error while accessing chat!');
            throw new Error(error.message);
        }
    }

};

const fetchChats = async(req,res) => {
    try {
        Chat.find({users:{$elemMatch: {$eq: req.userId}}})
        .populate("users","-password")
        .populate("latestMessage")
        .sort({updatedAt: -1})
        .then(async(results) => {
            results = await User.populate(results, {
                path:"latestMessage.sender",  
                select:"firstName lastName email",
            });

            res.status(200).send(results);
        })
    } catch (error) {
        res.status(400).send('Chat no found!')
    }
}

module.exports = {accessChat,fetchChats};