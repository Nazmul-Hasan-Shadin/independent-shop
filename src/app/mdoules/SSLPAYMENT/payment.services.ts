import axios from "axios";
import config from "../../../config";
import AppError from "../../error/AppError";
import prisma from "../../../utils/prisma";

const successUrl =
  process.env.NODE_ENV === "development"
    ? process.env.SUCCESS_URL_LOCAL
    : process.env.SUCCESS_URL;

const initPayment = async (orderInfo: any) => {

   const totalAmount= orderInfo.orderItems.reduce((initial:number,item:any)=> initial + Number(item.quantity * item.price),0)
    const createOrderIntoDb= await prisma.order.create({
    data:{
    shopId:orderInfo.shopId,
    customerId:orderInfo?.customerId,
    transactionId:orderInfo.transactionId,
    totalAmount:totalAmount,
    discountAmount:orderInfo?.discountAmount,
    orderItems:{
      create:orderInfo.orderItems.map((item:any)=>{
        console.log(item,'iam item');
        
        return (
          {
        productId:item.id,
        price:Number(item.quantity) * Number(item.price),
        quantity:item?.quantity
      }
        )
      })
    }

    }
  })

  const data = {
    total_amount: Number(totalAmount),
    currency: "BDT",
    tran_id: orderInfo.transactionId, // use unique tran_id for each api call
    // success_url: `https://independent-shop.vercel.app/api/v1/payment-gate/success/${orderInfo.transactionId}`,
    success_url:`${successUrl}/api/v1/payment-gate/success`,

    fail_url: "http://localhost:3030/fail",
    cancel_url: "http://localhost:3030/cancel",
    ipn_url: `https://api.rodro.online/api/v1/payment-gate/ipn`,

    shipping_method: "Courier",
    product_name: "Computer.",

    product_profile: "general",
    cus_name: "Customer Name",
    cus_email: "customer@example.com",
    cus_add1: "Dhaka",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    cus_fax: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
    store_id: config.payment.store_id,

    store_passwd: config.payment.store_pass,
  };
 


  const response = await axios.post(
    "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
    data,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  return {
    paymentUrl: response.data.GatewayPageURL,

  };
};
const validatePayment2 = async (payload: {
  val_id: string;
  tran_id?: string;
  status?: string;
}) => {
  try {
    const { val_id ,tran_id} = payload;
    if (val_id && tran_id) {
       prisma.order.update
    }

    const response = await axios.get(
      `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=${config.payment.store_id}&store_passwd=${config.payment.store_pass}&v=1&format=json`
    );

    // console.log(response,'of ipn');
    
    return response.data;
  } catch (error: any) {
    throw new Error(error?.message || "Payment validation failed");
  }
};
export const PaymentServicesSSL = {
  initPayment,
  // validatePayment,
  validatePayment2,
};
