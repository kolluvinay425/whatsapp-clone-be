import mongoose from "mongoose"
const { model, Schema } = mongoose;

const ConversationSchema = new Schema(
    {
        members:{type:Array,}
    },
    {
        timestamps:true
    }
)

export default model("Conversation", ConversationSchema);