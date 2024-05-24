import { Schema, model } from 'mongoose'
import { randomId } from '../../functions/randonUUID'
const suggestionConfig = new Schema({
    guildId: {
        type: String, 
        required: true
    }, 
    channelId: {
        type: String,
        required: false
    },
    roleId: {
        type: String
    },
    messageId: {
        type: String
    },
    authorId: {
        type: String
    },
    suggestionId: {
        type: String,
        default: randomId
    },
    messageContent: {
        type: String
    },
})

export default model('suggestionConfig', suggestionConfig)