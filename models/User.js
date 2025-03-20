import mongoose, {Schema} from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new Schema({});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

export default User;