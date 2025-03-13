"use client";
import { Booking, Hotel, Room } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import AmenityItem from "../AmenityItem";
import {
  AirVent,
  Bath,
  Bed,
  BedDouble,
  Castle,
  Home,
  Loader2,
  MountainSnow,
  Pencil,
  Ship,
  Trash,
  Trees,
  Tv,
  Users,
  UtensilsCrossed,
  VolumeX,
  Wifi,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import AddRoomForm from "./AddRoomForm";
import axios from "axios";
import { toast, useToast } from "@/hooks/use-toast";
import { DatePickerWithRange } from "./DateRangePicker";
import { DateRange } from "react-day-picker";
import { differenceInCalendarDays, set } from "date-fns";
import { Checkbox } from "../ui/checkbox";

interface RoomCardProps {
  hotel: Hotel & {
    rooms: Room[];
  };
  room: Room;
  bookings?: Booking[];
}

const RoomCard = ({ bookings, hotel, room }: RoomCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>();
  const [totalPrice, setTotalPrice] = useState(room.roomPrice);
  const [includeBreakFast, setIncludeBreakFast] = useState(false);
  const [days, setDays] = useState(1);

  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const isHotelDetailsPage = pathname.includes("hotel-details");

  useEffect(() => {
    if (date && date.from && date.to) {
      const dayCount = differenceInCalendarDays(date.to, date.from);

      setDays(dayCount);

      if (dayCount && room.roomPrice) {
        if (includeBreakFast && room.breakFastPrice) {
          setTotalPrice(
            dayCount * room.roomPrice + dayCount * room.breakFastPrice
          );
        } else {
          setTotalPrice(dayCount * room.roomPrice);
        }
      } else {
        setTotalPrice(room.roomPrice);
      }
    }
  }, [date, room.roomPrice, includeBreakFast]);

  const handleDialogOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleRoomDelete = async (room: Room) => {
    setIsLoading(true);
    const imageKey = room.image.substring(room.image.lastIndexOf("/") + 1);

    axios
      .post("/api/uploadthing/delete", { imageKey })
      .then(() => {
        axios
          .delete(`/api/room/${room.id}`)
          .then(() => {
            router.refresh();
            toast({
              variant: "success",
              description: "🎉 Room Deleted!",
            });
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
            toast({
              variant: "destructive",
              description: "Somethiong went wrong",
            });
          });
      })
      .catch(() => {
        setIsLoading(false);
        toast({
          variant: "destructive",
          description: "Somethiong went wrong",
        });
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{room.title}</CardTitle>
        <CardDescription>{room.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="aspect-square overflow-hidden relative h-[200px] rounded-lg">
          <Image
            fill
            src={room.image}
            alt={room.title}
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 content-start text-sm">
          <AmenityItem>
            <Bed className="h-4 w-4" />
            {room.bedCount} Bed{"(s)"}
          </AmenityItem>
          <AmenityItem>
            <Users className="h-4 w-4" />
            {room.guestCount} Guest{"(s)"}
          </AmenityItem>
          <AmenityItem>
            <Bath className="h-4 w-4" />
            {room.bathroomCount} Bathroom{"(s)"}
          </AmenityItem>
          {!!room.kingBed && (
            <AmenityItem>
              <BedDouble className="h-4 w-4" />
              {room.kingBed} King Bed{"(s)"}
            </AmenityItem>
          )}
          {!!room.queenBed && (
            <AmenityItem>
              <BedDouble className="h-4 w-4" />
              {room.queenBed} Queen Bed{"(s)"}
            </AmenityItem>
          )}
          {room.roomService && (
            <AmenityItem>
              <UtensilsCrossed className="h-4 w-4" />
              Room Service
            </AmenityItem>
          )}
          {room.TV && (
            <AmenityItem>
              <Tv className="h-4 w-4" />
              TV
            </AmenityItem>
          )}
          {room.balcony && (
            <AmenityItem>
              <Home className="h-4 w-4" />
              Balcony
            </AmenityItem>
          )}
          {room.freeWifi && (
            <AmenityItem>
              <Wifi className="h-4 w-4" />
              Free Wifi
            </AmenityItem>
          )}
          {room.cityView && (
            <AmenityItem>
              <Castle className="h-4 w-4" />
              City View
            </AmenityItem>
          )}
          {room.oceanView && (
            <AmenityItem>
              <Ship className="h-4 w-4" />
              Ocean View
            </AmenityItem>
          )}
          {room.forestView && (
            <AmenityItem>
              <Trees className="h-4 w-4" />
              Forest View
            </AmenityItem>
          )}
          {room.mountainView && (
            <AmenityItem>
              <MountainSnow className="h-4 w-4" />
              Mountain View
            </AmenityItem>
          )}
          {room.airCondition && (
            <AmenityItem>
              <AirVent className="h-4 w-4" />
              Air Conditioning
            </AmenityItem>
          )}
          {room.soundProof && (
            <AmenityItem>
              <VolumeX className="h-4 w-4" />
              Sound Proof
            </AmenityItem>
          )}
        </div>
        <Separator />
        <div className="flex gap-4 justify-between">
          <div className="">
            Room Price: <span className="font-bold">${room.roomPrice}</span>
            <span className="text-xs"> /24hrs</span>
          </div>
          {!!room.breakFastPrice && (
            <div>
              BreakFast Price:{" "}
              <span className="font-bold">${room.breakFastPrice}</span>
            </div>
          )}
        </div>
        <Separator />
      </CardContent>

      <CardFooter>
        {isHotelDetailsPage ? (
          <div className="flex flex-col gap-6">
            <div>
              <div className="mb-2">
                Select days that you will spend in this room
              </div>
              <DatePickerWithRange date={date} setDate={setDate} />
            </div>
            {room.breakFastPrice > 0 && (
              <div className="">
                <div className="mb-2">
                  Do you want to be served breakfast each day
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="breakFast"
                    onCheckedChange={(value) => setIncludeBreakFast(!!value)}
                  />
                  <label htmlFor="breakFast" className="">
                    Include BreakFast
                  </label>
                </div>
              </div>
            )}
            <div className="">
              Total Price: <span className="font-bold">${totalPrice}</span> for{" "}
              <span className="font-bold">{days} Days</span>
            </div>
          </div>
        ) : (
          <div className="flex w-full justify-between">
            <Button
              disabled={isLoading}
              variant="ghost"
              onClick={() => handleRoomDelete(room)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="maxw-[150px]"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Update Room
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[900px] w-[90%]">
                <DialogHeader className="px-2">
                  <DialogTitle>Update Room</DialogTitle>
                  <DialogDescription>
                    make changes to this room.
                  </DialogDescription>
                </DialogHeader>
                <AddRoomForm
                  hotel={hotel}
                  room={room}
                  handleDialogOpen={handleDialogOpen}
                />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default RoomCard;
