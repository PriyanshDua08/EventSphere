import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['participant', 'organizer'], required: true },
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } });

userSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.userId = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  },
});

export default mongoose.model('User', userSchema);
