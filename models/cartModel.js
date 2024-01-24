import { Schema, model } from "mongoose";

const CartSchema = new Schema({
  items: [
    {
      record: {
        type: Schema.Types.ObjectId,
        ref: "Record",
      },

      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

export default model("Cart", CartSchema);
