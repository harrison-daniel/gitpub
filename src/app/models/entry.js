import mongoose, { Schema } from 'mongoose';

const entrySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    streetAddress: String,
    cityStateAddress: String,
    description: String,
    date: Date,
    websiteUrl: String,
    phoneNumber: String,

    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

entrySchema.index({ userId: 1 });

const Entry = mongoose.models.Entry || mongoose.model('Entry', entrySchema);

export default Entry;
