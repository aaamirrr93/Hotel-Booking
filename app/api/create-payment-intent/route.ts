// import BookRoom from "@/app/book-room/page";
// import prismadb from "@/lib/prismadb";
// import { currentUser } from "@clerk/nextjs/server";
// import { NextRequest, NextResponse } from "next/server";
// import Stripe from "stripe";
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//   apiVersion: "2025-02-24.acacia",
// });

// export async function POST(req: NextRequest) {
//   const user = await currentUser();

//   if (!user) {
//     return new NextResponse("Unauthorized", { status: 401 });
//   }

//   const body = await req.json();
//   const { booking, payment_intent_id } = body;

//   const bookingData = {
//     ...booking,
//     userName: user.firstName,
//     userEmail: user.emailAddresses[0].emailAddress,
//     userId: user.id,
//     currency: "usd",
//     paymentIntentId: payment_intent_id,
//   };

//   let foundBooking;

//   if (payment_intent_id) {
//     foundBooking = await prismadb.booking.findUnique({
//       where: {
//         paymentIntentId: payment_intent_id,
//         userId: user.id,
//       },
//     });
//   }

//   if (foundBooking && payment_intent_id) {
//     //update the booking
//   } else {
//     //create the booking
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: booking.totalPrice * 100,
//       currency: bookingData.currency,
//       automatic_payment_methods: {
//         enabled: true,
//       },
//     });

//     bookingData.paymentIntentId = paymentIntent.id;
//     await prismadb.booking.create({
//       data: bookingData,
//     });

//     return NextResponse.json({ paymentIntent });
//   }

//   return NextResponse.json("Internal Server Error", { status: 500 });
// }

// ************************************************************************************************
// import prismadb from "@/lib/prismadb";
// import { currentUser } from "@clerk/nextjs/server";
// import { NextRequest, NextResponse } from "next/server";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//   apiVersion: "2025-02-24.acacia",
// });

// export async function POST(req: NextRequest) {
//   try {
//     console.log("📢 API called: /api/create-payment-intent");

//     const user = await currentUser();
//     if (!user) {
//       console.error("🚨 Unauthorized request - No user found");
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     console.log("✅ User authenticated:", user.id);

//     const body = await req.json();
//     console.log("📦 Request body:", body);

//     const { booking, payment_intent_id } = body;

//     if (!booking || !booking.totalPrice) {
//       console.error("❌ Invalid booking data", body);
//       return NextResponse.json(
//         { error: "Invalid booking data" },
//         { status: 400 }
//       );
//     }

//     console.log("💰 Creating payment intent for:", booking.totalPrice);

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: booking.totalPrice * 100,
//       currency: "usd",
//       automatic_payment_methods: { enabled: true },
//     });

//     console.log("✅ PaymentIntent created:", paymentIntent.id);
//     console.log("😒Client Secret:", paymentIntent.client_secret);

//     return NextResponse.json({ paymentIntent });
//     // return NextResponse.json({ clientSecret: paymentIntent.client_secret });
//   } catch (error: any) {
//     console.error("🔥 Internal Server Error:", error);

//     return new Response(
//       JSON.stringify({
//         error: "Internal Server Error",
//         details: error.message,
//       }),
//       {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       }
//     );
//   }
// }

/////////////////////////////// final version ///////////////////////////////

import BookRoom from "@/app/book-room/page";
import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: NextRequest) {
  console.log("1. ☑️start use auth");
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("✅ User authenticated:", user.id);

    const body = await req.json();
    const { booking, payment_intent_id } = body;

    console.log("2. 📦 Request body:", body);

    console.log("3. ☑️ start check booking and totalprice");
    if (!booking || !booking.totalPrice) {
      return NextResponse.json(
        { error: "Invalid booking data" },
        { status: 400 }
      );
    }
    console.log("✅ Booking and totalPrice are valid");

    console.log("4. ☑️ start create booking");
    const bookingData = {
      ...booking,
      userName: user.firstName,
      userEmail: user.emailAddresses[0].emailAddress,
      userId: user.id,
      currency: "usd",
      paymentIntentId: payment_intent_id,
    };
    console.log("✅ Booking data:", bookingData);

    let foundBooking;

    console.log("5. ☑️ start check payment_intent_id");
    if (payment_intent_id) {
      foundBooking = await prismadb.booking.findUnique({
        where: {
          paymentIntentId: payment_intent_id,
          userId: user.id,
        },
      });
    }
    console.log("✅ Found booking:", foundBooking);

    if (foundBooking && payment_intent_id) {
      //update the booking
      const current_intent = await stripe.paymentIntents.retrieve(
        payment_intent_id
      );
      if (current_intent) {
        const updated_intent = await stripe.paymentIntents.update(
          payment_intent_id,
          {
            amount: Math.round(booking.totalPrice * 100),
          }
        );

        const res = await prismadb.booking.update({
          where: {
            paymentIntentId: payment_intent_id,
            userId: user.id,
          },
          data: bookingData,
        });

        if (!res) {
          return NextResponse.error();
        }
        return NextResponse.json({
          clientSecret: updated_intent.client_secret,
          paymentIntentId: updated_intent.id,
        });
      }
    } else {
      //create the booking
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(booking.totalPrice * 100),
        currency: bookingData.currency,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      bookingData.paymentIntentId = paymentIntent.id;
      await prismadb.booking.create({
        data: bookingData,
      });

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    }

    // try {
    //   console.log("5. ☑️ start create stripe");
    //   // Create the booking payment intent
    //   const paymentIntent = await stripe.paymentIntents.create({
    //     amount: Math.round(booking.totalPrice * 100), // Ensure it's an integer
    //     currency: bookingData.currency,
    //     automatic_payment_methods: {
    //       enabled: true,
    //     },
    //   });
    //   console.log("✅ Payment intent created:", paymentIntent);

    //   if (!paymentIntent || !paymentIntent.client_secret) {
    //     throw new Error("Failed to create payment intent");
    //   }

    //   console.log("6. ☑️ start create booking in db");
    //   // Save booking to database
    //   bookingData.paymentIntentId = paymentIntent.id;
    //   await prismadb.booking.create({
    //     data: bookingData,
    //   });
    //   console.log("✅ Booking saved to database");

    //   // Return only what's needed
    //   return NextResponse.json({
    //     clientSecret: paymentIntent.client_secret,
    //     paymentIntentId: paymentIntent.id,
    //   });
    // } catch (stripeError: any) {
    //   console.error("Stripe API Error:", stripeError);
    //   return NextResponse.json(
    //     { error: "Payment processing error", details: stripeError.message },
    //     { status: 400 }
    //   );
    // }
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
