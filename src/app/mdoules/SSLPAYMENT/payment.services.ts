import axios from "axios";
import config from "../../../config";
import AppError from "../../error/AppError";

const successUrl =
  process.env.NODE_ENV === "development"
    ? process.env.SUCCESS_URL_LOCAL
    : process.env.SUCCESS_URL;

const initPayment = async (orderInfo: any) => {
  const data = {
    total_amount: Number(orderInfo.price),
    currency: "BDT",
    tran_id: orderInfo.transactionId, // use unique tran_id for each api call
    // success_url: `https://independent-shop.vercel.app/api/v1/payment-gate/success/${orderInfo.transactionId}`,
    success_url:`${successUrl}/api/v1/payment-gate/success/${orderInfo.transactionId}`,

    fail_url: "http://localhost:3030/fail",
    cancel_url: "http://localhost:3030/cancel",
    ipn_url: "https://independent-shop.vercel.app/payment-gate/ipn",

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

const validatePayment = async (payload: any) => {
  console.log("iam called", payload);

  try {
    const response = await axios({
      method: "GET",
      url: `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?wsdl?val_id=${payload.val_id}&store_id=${config.payment.store_id}&store_passwd=${config.payment.store_pass}&format=json`,
    });
    console.log(response,'validate payment response')
    return response.data;
  } catch (error) {
    throw new AppError(500, "payment validation failed");
  }
};

const validatePayment2 = async (payload: {
  val_id: string;
  tran_id?: string;
  status?: string;
}) => {
  try {
    const { val_id } = payload;
    payload;

    const response = await axios.get(
      `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=${config.payment.store_id}&store_passwd=${config.payment.store_pass}&v=1&format=json`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.message || "Payment validation failed");
  }
};
export const PaymentServicesSSL = {
  initPayment,
  validatePayment,
  validatePayment2,
};
