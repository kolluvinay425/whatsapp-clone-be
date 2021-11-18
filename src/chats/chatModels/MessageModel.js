import mongoose from "mongoose"
const { model, Schema } = mongoose;

const MessageSchema = new Schema(
    {
        conversationId:{type: String},
        sender:{type: String},
        text:{type: String}
    },
    {
        timestamps:true
    }
)

export default model("chatHistory", MessageSchema);