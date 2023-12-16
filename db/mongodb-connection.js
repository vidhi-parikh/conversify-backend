const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect('mongodb+srv://parikhvidhi10:6OHV5Yw6mEzSSOf6@conversify-cluster.hvruu3h.mongodb.net/?retryWrites=true&w=majority')   
        console.log('db connected!!')
    }

    catch(err) {
        console.log('db failed to connect! due to',err)
    }
}


module.exports = connectDB