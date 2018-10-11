import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const userSchema = new Schema({
    displayName: {
        type: String,
        default: null
    },
    email: {
        type: String,
        default: null
    },
    facebookId: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: null
    }
}, 
{
        timestamps: true, versionKey: false
});

export default mongoose.model('User', userSchema);
