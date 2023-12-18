import mongoose, { Schema } from 'mongoose';

const entrySchema = new Schema(
  {
    title: String,
    streetAddress: String,
    cityStateAddress: String,
    description: String,
    date: Date,
    websiteUrl: String,

    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Entry = mongoose.models.Entry || mongoose.model('Entry', entrySchema);

export default Entry;
