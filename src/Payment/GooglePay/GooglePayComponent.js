import React from "react";
import GooglePayButton from "@google-pay/button-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GooglePayComponent = ({
  tripInfo,
  customerInfo,
  pickupDropoff,
  totalAmount,
}) => {
  const navigate = useNavigate();

  const handlePaymentSuccess = async (paymentRequest) => {
    console.log("Google Pay Success", paymentRequest);

    try {
      const response = await axios.post(
        "http://localhost:3500/api/processGooglePay",
        {
          token: paymentRequest.paymentMethodData.tokenizationData.token,
        }
      );

      if (response.data.success) {
        console.log("Thanh toán thành công:", response.data);
        navigate("/ketquathanhtoan", {
          state: {
            transactionId: response.data.transactionId || null,
            tripInfo: tripInfo || {},
            customerInfo: customerInfo || {},
            pickupDropoff: pickupDropoff || {},
            totalAmount: totalAmount || 0,
            selectedPaymentMethod: "Google Pay",
          },
        });
      } else {
        console.error("Thanh toán thất bại:", response.data);
        alert("Thanh toán thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi xử lý thanh toán:", error);
      alert("Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.");
    }
  };

  return (
    <GooglePayButton
      environment="TEST" // Đổi thành "PRODUCTION" khi deploy thực tế
      paymentRequest={{
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: "CARD",
            parameters: {
              allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
              allowedCardNetworks: ["VISA", "MASTERCARD"],
            },
            tokenizationSpecification: {
              type: "PAYMENT_GATEWAY",
              parameters: {
                gateway: "example",
                gatewayMerchantId: "exampleMerchantId",
              },
            },
          },
        ],
        merchantInfo: {
          merchantId: "12345678901234567890", // Cập nhật Merchant ID của bạn
          merchantName: "Your Business Name",
        },
        transactionInfo: {
          totalPriceStatus: "FINAL",
          totalPriceLabel: "Total",
          totalPrice: totalAmount ? totalAmount.toFixed(2) : "0.00",
          currencyCode: "VND",
          countryCode: "VN",
        },
      }}
      onLoadPaymentData={handlePaymentSuccess}
    />
  );
};

export default GooglePayComponent;
