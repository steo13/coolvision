import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
});

const UserSchema = mongoose.model('User', userSchema)

export { UserSchema }