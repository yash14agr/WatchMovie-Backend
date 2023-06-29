import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const userSchema = new Schema({
    Name: {
        type: String,
        required: true
    },
    UserName: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    }
})

const UserSchema = new model('UserSchema', userSchema)
export default UserSchema;