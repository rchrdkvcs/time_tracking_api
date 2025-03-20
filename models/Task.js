import mongoose, {Schema} from 'mongoose';

const taskSchema = new Schema({
    name: String,
    description: String,
    startDate: {type: Date, default: Date.now},
    endDate: {type: Date, default: Date.now},
    priority: {type: String, default: 'normal'},
    status: {type: String, default: 'incomplete'},
    project: {type: Schema.Types.ObjectId, ref: 'Project', required: true},
}, {timestamps: true});

const Task = mongoose.model('Task', taskSchema);

export default Task;