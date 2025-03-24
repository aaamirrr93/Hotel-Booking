import { getBookingsByUserId } from "@/actions/getBookingByUserId";
import { getBookingsByHotelOwnerId } from "@/actions/getBookingsByHotelOwnerId";
import MyBookingsClient from "@/components/booking/MyBookingsClient";
import React from "react";

const MyBookings = async () => {
  const bookingsFromVisitors = await getBookingsByHotelOwnerId();
  const bookingsIHaveMade = await getBookingsByUserId();
  return (
    <div className="flex flex-col gap-10">
      {!!bookingsIHaveMade?.length && (
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-6 mt-2">
            Here are bookins you have made
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {bookingsIHaveMade.map((bookings) => (
              <MyBookingsClient booking={bookings} key={bookings.id} />
            ))}
          </div>
        </div>
      )}
      {!!bookingsFromVisitors?.length && (
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-6 mt-2">
            Here are bookings visitors have made on your peroperties.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {bookingsFromVisitors.map((bookings) => (
              <MyBookingsClient booking={bookings} key={bookings.id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
