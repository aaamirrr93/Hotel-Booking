// import { getHotelById } from "@/actions/getHotelById";
// import AddHotelForm from "@/components/hotel/AddHotelForm";
// import { auth } from "@clerk/nextjs/server";

// interface HotelPageProps {
//   params: {
//     hotelId: string;
//   };
// }

// const Hotel = async ({ params }: HotelPageProps) => {
//   const hotelId = await params.hotelId;
//   const hotel = await getHotelById(hotelId);
//   // const hotel = await getHotelById(params.hotelId);
//   const { userId } = await auth();

//   if (!userId) return <div>not authenticated ....</div>;
//   if (hotel && hotel.userId !== userId) return <div>access denied ....</div>;
//   return (
//     <div>
//       <AddHotelForm hotel={hotel} />
//     </div>
//   );
// };

// export default Hotel;

import { getHotelById } from "@/actions/getHotelById";
import AddHotelForm from "@/components/hotel/AddHotelForm";
import { auth } from "@clerk/nextjs/server";

interface HotelPageProps {
  params: Promise<{
    hotelId: string;
  }>;
}

const Hotel = async ({ params }: HotelPageProps) => {
  const resolvedParams = await params;
  const hotel = await getHotelById(resolvedParams.hotelId);
  const { userId } = await auth();

  if (!userId) return <div>not authenticated ....</div>;
  if (hotel && hotel.userId !== userId) return <div>access denied ....</div>;
  return (
    <div>
      <AddHotelForm hotel={hotel} />
    </div>
  );
};

export default Hotel;
