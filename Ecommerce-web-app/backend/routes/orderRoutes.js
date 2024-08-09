import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import { isAuth, isAdmin } from "../utils.js";
import { sendMail } from "../sendMail.js";

const orderRouter = express.Router();

orderRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find().populate("user", "name");
    res.send(orders);
  })
);

orderRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newOrder = new Order({
      orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });

    const order = await newOrder.save();

    sendMail({
      email: order.shippingAddress.email,
      subject: "Thank You for placing your order",
      message: `
Hi, ${order.shippingAddress.fullName}!
Your Order id is # ${order._id}.
Your order will be delivered to you in 3-4 working days.

Product(s) included in the order:
${order.orderItems.map((item) => item.name)}

Shipping Details:
Name: ${order.shippingAddress.fullName}
Address: ${order.shippingAddress.address}
City: ${order.shippingAddress.city}
Phone: ${order.shippingAddress.phone}

Price Calculations:
Items Price: £${order.itemsPrice}
Items Quantity: ${order.orderItems.map((item) => item.quantity)}
Shipping Charges: £${order.shippingPrice}
________________________________
Total Amount: £${order.totalPrice}

Payment Method: ${order.paymentMethod}

Need Any Help?

To check your order status, go to your Account > Order History.
Please note that your order will not be processed until you clear payment.

Order not delivered yet?
Please contact us on our email 'techandtechnician@gmail.com'.
Or directly reach us at '01642 432 036'.

Regards: 
        Tech&Technician & Team
        Happy Shopping!
`,
    });

    res.status(201).send({ message: "New Order Created", order });
  })
);

orderRouter.get(
  "/summary",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const products = await Product.aggregate([
      {
        $group: {
          _id: null,
          numProducts: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          sales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ users, products, orders, dailyOrders, productCategories });
  })
);

orderRouter.get(
  "/mine",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  })
);

orderRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

orderRouter.put(
  "/:id/deliver",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      order.orderItems.forEach(async (o) => {
        await updateStock(o.product, o.quantity);
      });
      await order.save();

      sendMail({
        email: order.shippingAddress.email,
        subject: "Your Order has been Delivered Successfully",
        message: `
Hi, ${order.shippingAddress.fullName}!
Your Order with id number #${order._id} has been delivered to you.
  
Product(s) included in the order:
${order.orderItems.map((item) => item.name)}
  
Shipping Details:
Name: ${order.shippingAddress.fullName}
Address: ${order.shippingAddress.address}
City: ${order.shippingAddress.city}
Phone: ${order.shippingAddress.phone}
  
Payment Method: ${order.paymentMethod}

Price Calculations:
Items Price: £${order.itemsPrice}
Shipping Charges: £${order.shippingPrice}
________________________________
Total Amount: £${order.totalPrice}
  
Need Any Help?

To check your order status, go to your Account > Order History.
Please note that your order will not be processed until you clear payment.

Order not delivered yet?
Please contact us on our email 'techandtechnician@gmail.com'.
Or directly reach us at '01642 432 036'.

Regards: 
        Tech&Technician & Team
        Happy Shopping!
`,
      });
      res.send({ message: "Order Delivered" });
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.countInStock -= quantity;

  await product.save({ validateBeforeSave: false });
}

orderRouter.put(
  "/:id/shipped",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isShipped = true;
      await order.save();

      sendMail({
        email: order.shippingAddress.email,
        subject: "Your Package is on its way",
        message: `
Hi, ${order.shippingAddress.fullName}!
Your Order with id number #${order._id} has been shipped.
Your order will reach you soon.
  
Product(s) included in the order:
${order.orderItems.map((item) => item.name)}
  
Shipping Details:
Name: ${order.shippingAddress.fullName}
Address: ${order.shippingAddress.address}
City: ${order.shippingAddress.city}
Phone: ${order.shippingAddress.phone}
  
Price Calculations:
Items Price: £${order.itemsPrice}
Shipping Charges: £${order.shippingPrice}
________________________________
Total Amount: £${order.totalPrice}
  
Payment Method: ${order.paymentMethod}
  
Need Any Help?

To check your order status, go to your Account > Order History.
Please note that your order will not be processed until you clear payment.

Order not delivered yet?
Please contact us on our email 'techandtechnician@gmail.com'.
Or directly reach us at '01642 432 036'.

Regards: 
        Tech&Technician & Team
        Happy Shopping!
`,
      });
      res.send({ message: "Order Shipped" });
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);
orderRouter.put(
  "/:id/cancel",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isCancelled = true;
      await order.save();

      sendMail({
        email: order.shippingAddress.email,
        subject: "Your Order has been cancelled",
        message: `
Hi, ${order.shippingAddress.fullName}!
Your Order with number #${order._id} is marked as cancelled.
  
Product(s) included in the order:
${order.orderItems.map((item) => item.name)}
  
Shipping Details:
Name: ${order.shippingAddress.fullName}
Address: ${order.shippingAddress.address}
City: ${order.shippingAddress.city}
Phone: ${order.shippingAddress.phone}
  
Price Calculations:
Items Price: £${order.itemsPrice}
Shipping Charges: £${order.shippingPrice}
________________________________
Total Amount: £${order.totalPrice}
  
Payment Method: ${order.paymentMethod}
  
Need Any Help?

To check your order status, go to your Account > Order History.
Please note that your order will not be processed until you clear payment.

Regards: 
        Tech&Technician & Team
        Happy Shopping!
`,
      });
      res.send({ message: "Order Delivered" });
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

orderRouter.put(
  "/:id/pay",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "email name"
    );
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();

      sendMail({
        email: order.shippingAddress.email,
        subject: "Your Order has been paid",
        message: `
Hi, ${order.shippingAddress.fullName}!
Your Order with number #${order._id} has been paid successfully.
  
Product(s) included in the order:
${order.orderItems.map((item) => item.name)}
  
Shipping Details:
Name: ${order.shippingAddress.fullName}
Address: ${order.shippingAddress.address}
City: ${order.shippingAddress.city}
Phone: ${order.shippingAddress.phone}
  
Price Calculations:
Items Price: £${order.itemsPrice}
Shipping Charges: £${order.shippingPrice}
________________________________
Total Amount: £${order.totalPrice}
  
Payment Method: ${order.paymentMethod}
  
Need Any Help?

To check your order status, go to your Account > Order History.
Please note that your order will not be processed until you clear payment.

Regards: 
        Tech&Technician & Team
        Happy Shopping!
`,
      });

      res.send({ message: "Order Paid", order: updatedOrder });
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

orderRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.remove();
      res.send({ message: "Order Deleted" });
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

export default orderRouter;
