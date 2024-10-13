const axios = require("axios");

const getPaymobToken = async () => {
  try {
    const authResponse = await axios.post(
      "https://accept.paymob.com/api/auth/tokens",
      { api_key: process.env.PAYMOB_API_KEY }
    );
    return authResponse.data.token;
  } catch (error) {
    console.error("Error getting Paymob token:", error);
  }
};

const getPaymobOrderId = async (paymobToken, priceWithCents) => {
  try {
    const paymobOrderResponse = await axios.post(
      "https://accept.paymob.com/api/ecommerce/orders",
      {
        auth_token: paymobToken,
        amount_cents: priceWithCents, // Convert to cents
        currency: "EGP",
        merchant_id: process.env.PAYMOB_MERCHANT_ID,
      }
    );
    return paymobOrderResponse.data.id; // This is your order ID.
  } catch (error) {
    console.error("Error creating Paymob order:", error);
  }
};

const getPaymentKey = async (
  paymobToken,
  paymobOrderId,
  priceWithCents,
  billingData
) => {
  try {
    const paymentKeyResponse = await axios.post(
      "https://accept.paymob.com/api/acceptance/payment_keys",
      {
        auth_token: paymobToken,
        amount_cents: priceWithCents, // e.g., 10000 for 100 EGP
        expiration: 3600,
        order_id: paymobOrderId,
        billing_data: billingData,
        currency: "EGP",
        integration_id: process.env.PAYMOB_INTEGRATION_ID,
      }
    );
    return paymentKeyResponse.data.token;
  } catch (error) {
    console.error("Error creating payment key:", error.message);
  }
};

module.exports = {
  getPaymobToken,
  getPaymobOrderId,
  getPaymentKey,
};
