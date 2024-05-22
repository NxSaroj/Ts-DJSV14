import { Schema, model } from 'mongoose'

const welcomeConfig = new Schema({
    channelId: {
        type: String, 
        required: true
    }, 
    guildId: {
        type: String,
        required: true
    }, 
    welcomeMessage: {
        type: String, 
       required: true
    }
})

export default model('welcomeConfig', welcomeConfig)