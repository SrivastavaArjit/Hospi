const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const doctorSchema = new Schema(
  {
    firstname: String,
    lastname: String,
    location: String,
    rating: {
      type: Number,
      default: 5.0,
    },
    image: {
      type: String,
    },
    specialization: {
      type: String,
      default: "Surgeon",
    },
    description: String,
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  opts
);

doctorSchema.virtual("properties.popUpMarkup").get(function () {
  return `<a href="/doctors/${this._id}">${this.firstname} ${this.lastname}</a>
          <p>${this.location}</p>`;
});

module.exports = mongoose.model("Doctor", doctorSchema);
