import { getHotelById } from "@/actions/getHotelById";
import HotelDetailsClient from "@/components/hotel/HotelDetailsClient";

interface HotelDetailsProps {
  params: { hotelId: string };
}

const HotelDetails = async ({ params }: HotelDetailsProps) => {
  const { hotelId } = await params;
  const hotel = await getHotelById(hotelId);

  if (!hotel) return <div>Oops! Hotel with given Id not found...</div>;
  return (
    <div className="">
      <HotelDetailsClient hotel={hotel} />
    </div>
  );
};

export default HotelDetails;
