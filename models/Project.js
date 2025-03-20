import {model, Schema} from "mongoose";

const ProjectSchema = new Schema({
    name: String,
    user: {type: Schema.Types.ObjectId, ref: "User"},
    tasks: [{type: Schema.Types.ObjectId, ref: "Task"}]
}, {timestamps: true});

export default model('Project', ProjectSchema);