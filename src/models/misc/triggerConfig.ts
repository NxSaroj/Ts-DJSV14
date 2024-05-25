import { Schema, model } from 'mongoose'

const triggerConfig = new Schema({
    guildId: {
        type: String,
        required: true
    },
    authorId: {
        type: String,
        required: true
    },
    triggerName: {
        type: String,
        required: true
    },
    triggerContent: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
})

export default model('triggerConfig', triggerConfig)