import { Schema, model } from 'mongoose'
import { randomId } from '../../functions/randonUUID'
const suggestionConfig = new Schema({
    guildId: {
        type: String, 
        required: true
    }, 
    channelId: {
        type: String,
        required: true
    },
    roleId: {
        type: String
    },
    suggestionId: {
        type: String,
        default: randomId
    }  
})

export default model('suggestionConfig', suggestionConfig)