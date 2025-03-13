import { getHotels } from "@/actions/getHotels";
import HotelList from "@/components/hotel/HotelList";

interface HomeProps {
  searchParams: {
    title: string;
    country: string;
    state: string;
    city: string;
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const { title, country, state, city } = await searchParams;

  const hotel = await getHotels({ title, country, state, city });
  if (!hotel) return <div>No hotels found...</div>;
  return (
    <div className="">
      <HotelList hotels={hotel} />
    </div>
  );
}
