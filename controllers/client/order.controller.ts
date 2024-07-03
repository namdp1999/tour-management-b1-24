import { Request, Response } from "express";
import Order from "../../models/order.model";
import { generateOrderCode } from "../../helpers/generate.helper";
import Tour from "../../models/tour.model";
import OrderItem from "../../models/order-item.model";

// [POST] /order/
export const order = async (req: Request, res: Response) => {
  const data = req.body;

  const dataOrder = {
    code: "",
    fullName: data.info.fullName,
    phone: data.info.phone,
    note: data.info.note,
    status: "initial",
  };

  const order = await Order.create(dataOrder);
  const orderId = order.dataValues.id;

  const code = generateOrderCode(orderId);

  await Order.update({
    code: code
  }, {
    where: {
      id: orderId
    }
  });

  for (const item of data.cart) {
    const dataOrderItem = {
      orderId: orderId,
      tourId: item.tourId,
      quantity: item.quantity
    };

    const tourInfo = await Tour.findOne({
      where: {
        id: item.tourId,
        deleted: false,
        status: "active"
      },
      raw: true
    });

    dataOrderItem["price"] = tourInfo["price"];
    dataOrderItem["discount"] = tourInfo["discount"];
    dataOrderItem["timeStart"] = tourInfo["timeStart"];

    await OrderItem.create(dataOrderItem);
  }

  res.json({
    code: 200,
    message: "Đặt hàng thành công!",
    orderCode: code
  });
};