"use client";
import useBookRoom from "@/hooks/useBookRoom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import RoomCard from "../room/RoomCard";
import RoomPaymentForm from "./RoomPaymentForm";
import { use, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
  {
    betas: ["custom_checkout_beta_6"],
  }
);

const BookingRoomClient = () => {
  const { bookingRoomData, clientSecret } = useBookRoom();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: theme === "dark" ? "night" : "stripe",
      labels: "floating",
    },
  };

  const handleSetPaymentSuccess = (value: boolean) => {
    setPaymentSuccess(value);
  };

  if (pageLoaded && !paymentSuccess && (!bookingRoomData || !clientSecret))
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="text-rose-500">
          Oops! this page could not be propery loaded...
        </div>
        <div className="flex item-center gap-4">
          <Button onClick={() => router.push("/")} variant="outline">
            Go Home
          </Button>
          <Button onClick={() => router.push("/my-bookings")}>
            View Bookings
          </Button>
        </div>
      </div>
    );

  if (paymentSuccess)
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="text-teal-500 text-center">Payment Successful!</div>
        <Button onClick={() => router.push("/my-bookings")}>
          View Bookings
        </Button>
      </div>
    );

  return (
    <div className="max-w-[700px] mx-auto">
      {clientSecret && bookingRoomData && (
        <div>
          <h3 className="text-2xl font-semibold mb-6">
            Complete payment to reserve this room!
          </h3>
          <div className="mb-6">
            <RoomCard room={bookingRoomData.room} />
          </div>
          <Elements stripe={stripePromise} options={options}>
            <RoomPaymentForm
              clientSecret={clientSecret}
              handleSetPaymentSuccess={handleSetPaymentSuccess}
            />
          </Elements>
        </div>
      )}
    </div>
  );
};
export default BookingRoomClient;
