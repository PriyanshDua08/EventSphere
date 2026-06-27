import mongoose from 'mongoose';

const subEventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'General' },
  venue: { type: String, required: true },
  dateTime: { type: Date, required: true },
  durationMins: { type: Number, default: 60 },
  capacity: { type: Number, required: true, min: [1, 'Capacity must be greater than zero'] },
  points: { type: Number, default: 10 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

subEventSchema.virtual('registered', {
  ref: 'Registration',
  localField: '_id',
  foreignField: 'subEventId',
  count: true,
});

subEventSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.subEventId = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export default mongoose.model('SubEvent', subEventSchema);
