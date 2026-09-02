import axios from "axios";
import { useToast } from "./use-toast";

const Esewa = () => {
  const { toast } = useToast();

  const generatePayment = async ({
    amount,
    productId,
    paymentGateway = "esewa",
    customerName = "",
    customerEmail = "",
    customerPhone = "",
    productName = "Product",
  }) => {
    if (!amount || Number(amount) <= 0) {
      toast({
        title: "Invalid payment amount",
        variant: "destructive",
      });
      return null;
    }

    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/initiate-payment",
        {
          amount: Number(amount),
          productId: productId || `txn-${Date.now()}`,
          paymentGateway,
          customerName,
          customerEmail,
          customerPhone,
          productName,
        },
      );
      return res.data;
    } catch (error) {
      toast({
        title: error.response?.data?.message || "Failed to generate payment",
        variant: "destructive",
      });
      return null;
    }
  };

  const verifyPayment = async (order) => {
    if (!order?.url) {
      toast({
        title: "Payment URL not received",
        variant: "destructive",
      });
      return false;
    }

    window.open(order.url, "_blank");
    return true;
  };

  return { generatePayment, verifyPayment };
};

export default Esewa;
