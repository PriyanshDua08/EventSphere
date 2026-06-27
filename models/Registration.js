import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  participantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subEventId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubEvent', required: true },
  status: { type: String, enum: ['registered', 'checked-in'], default: 'registered' },
  registeredAt: { type: Date, default: Date.now },
  checkedInAt: { type: Date, default: null },
});

// One registration per participant per sub-event (PRD 10.3)
registrationSchema.index({ participantId: 1, subEventId: 1 }, { unique: true });

registrationSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.registrationId = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export default mongoose.model('Registration', registrationSchema);
