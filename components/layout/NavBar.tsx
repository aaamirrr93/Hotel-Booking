"use client";
import { useAuth, UserButton } from "@clerk/nextjs";
import React from "react";
import Container from "../container";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import SearchInput from "../search-input";
import { ModeToggle } from "../theme-toggle";
import { NavMenu } from "./NavMenu";

function NavBar() {
  const router = useRouter();
  const { userId } = useAuth();

  return (
    <div className="sticky top-0 border border-b-primary/10 bg-secondary">
      <Container>
        <div className="flex justify-between items-center">
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <Image src="/logo.png" width="30" height="30" alt="logo" />
            <div className="font-extrabold text-xl">StaySavvy</div>
          </div>
          <SearchInput />
          <div className=" flex gap-3 items-center">
            <div className="">
              <ModeToggle />
              <NavMenu />
            </div>
            <UserButton afterSignOutUrl="/" />
            {!userId && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/sign-in")}
                >
                  Sign in
                </Button>
                <Button size="sm" onClick={() => router.push("/sign-out")}>
                  Sign out
                </Button>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default NavBar;
