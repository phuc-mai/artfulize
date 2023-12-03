import { Schema, model, models } from "mongoose";

const CartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Work',
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

const Cart = models.Cart || model("Cart", CartSchema);

export default Cart;