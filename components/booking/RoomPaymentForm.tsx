"use client";
import React, { FormEvent, useEffect, useState } from "react";
import {
  AddressElement,
  PaymentElement,
  useCheckout,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import useBookRoom from "@/hooks/useBookRoom";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "../ui/separator";
import moment from "moment";
import { Button } from "../ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Terminal } from "lucide-react";
import { Booking } from "@prisma/client";
import { endOfDay, isWithinInterval, startOfDay } from "date-fns";

interface RoomPaymentFormProps {
  clientSecret: string;
  handleSetPaymentSuccess: (value: boolean) => void;
}

type DateRangeType = {
  startDate: Date;
  endDate: Date;
};

const hasOverlap = (
  startDate: Date,
  endDate: Date,
  dateRange: DateRangeType[]
) => {
  const targetInterval = {
    start: startOfDay(new Date(startDate)),
    end: endOfDay(new Date(endDate)),
  };

  for (const range of dateRange) {
    const rangeStart = startOfDay(new Date(range.startDate));
    const rangeEnd = endOfDay(new Date(range.endDate));

    if (
      isWithinInterval(targetInterval.start, {
        start: rangeStart,
        end: rangeEnd,
      }) ||
      isWithinInterval(targetInterval.end, {
        start: rangeStart,
        end: rangeEnd,
      }) ||
      (targetInterval.start < rangeStart && targetInterval.end > rangeEnd)
    ) {
      return true;
    }
  }
  return false;
};
const RoomPaymentForm = ({
  clientSecret,
  handleSetPaymentSuccess,
}: RoomPaymentFormProps) => {
  const { bookingRoomData, resetBookRoom } = useBookRoom();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!stripe) return;
    if (!clientSecret) return;
    handleSetPaymentSuccess(false);
    setIsLoading(false);
  }, [stripe]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!stripe || !elements || !bookingRoomData) return;

    try {
      // date overlaps
      const bookings = await axios.get(
        `/api/booking/${bookingRoomData.room.hotelId}`
      );

      const roomBookingDates = bookings.data.map((booking: Booking) => {
        return {
          startDate: booking.startDate,
          endDate: booking.endDate,
        };
      });

      const overlapFound = hasOverlap(
        bookingRoomData.startDate,
        bookingRoomData.endDate,
        roomBookingDates
      );

      if (overlapFound) {
        setIsLoading(false);
        toast({
          title: "Error",
          description:
            "Oops! Some of the days you are to book habe already been reserved. Please go back and select different dates or rooms.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      stripe
        .confirmPayment({
          elements,
          redirect: "if_required",
        })
        .then((result) => {
          if (!result.error) {
            axios
              .patch(`/api/booking/${result.paymentIntent.id}`)
              .then(() => {
                toast({
                  title: "Payment Successful",
                  description: "🎉 Room Reserved!",
                });
                router.refresh();
                resetBookRoom();
                handleSetPaymentSuccess(true);
                setIsLoading(false);
              })
              .catch((error) => {
                console.log(error);
                toast({
                  title: "Something went wrong",
                  description: "Please try again later",
                  variant: "destructive",
                });
                setIsLoading(false);
              });
          } else {
            console.log(result.error.message);
            setIsLoading(false);
          }
        });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  if (!bookingRoomData?.startDate || !bookingRoomData?.endDate)
    return <div>ERROR : Missing reservation dates...</div>;

  const startDate = moment(bookingRoomData?.startDate).format("MMMM Do YYYY");
  const endDate = moment(bookingRoomData?.endDate).format("MMMM Do YYYY");

  return (
    <form onSubmit={handleSubmit} id="payment-form">
      <h2 className="font-semibold mb-2 text-lg">Billing Address</h2>
      <AddressElement options={{ mode: "billing" }} />
      <h2 className="font-semibold mt-4 mb-2 text-lg">Payment Information</h2>
      <PaymentElement options={{ layout: "tabs" }} />
      <div className="flex flex-col gap-1">
        <Separator />
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold mb-1 text-lg">Your Booking Summary</h2>
          <div className="">You will check-in on {startDate} at 5PM</div>
          <div className="">You will check-out on {endDate} at 5PM</div>
          {bookingRoomData?.breakFastIncluded && (
            <div className="">You will served breakfast each day at 8AM</div>
          )}
        </div>
        <Separator />
        <div className="font-bold text-lg mb-4">
          {bookingRoomData?.breakFastIncluded && (
            <div className="mb-2">
              Breakfast Price: ${bookingRoomData?.room.breakFastPrice} /day
            </div>
          )}
          Total Price: ${bookingRoomData?.totalPrice}
        </div>
      </div>

      {isLoading && (
        <Alert className="bg-indigo-600 text-white">
          <Terminal className="h-4 w-4 stroke-white" />
          <AlertTitle>Payment Processing...</AlertTitle>
          <AlertDescription>
            Please stay on this page we process your payment
          </AlertDescription>
        </Alert>
      )}

      <Button disabled={isLoading}>
        {isLoading ? "proccesing Payment..." : "Pay Now"}
      </Button>
    </form>
  );
};

export default RoomPaymentForm;
