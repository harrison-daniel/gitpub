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

    beers: [
      {
        name: { type: String, required: true, trim: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
      },
    ],

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
