"use client";
// pages/index.tsx
import React from "react";
import ExcelUploader from "../components/ExcelUploader";
import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { LoadingPage } from "../components/loadingSpinner";

const Home = () => {
  return (
    <>
      <ClerkLoading>
        <LoadingPage />
      </ClerkLoading>
      <ClerkLoaded>
        <main className="flex  flex-col  justify-between p-6 ">
          <div className="border  border-1">
            <div className="z-10 w-full  text-center p-3 font-mono text-sm ">
              <h1>Excel File Upload</h1>
            </div>
            <div className="z-10 w-full items-center justify-center p-3 font-mono text-sm lg:flex">
              <ExcelUploader />
            </div>
          </div>
        </main>
      </ClerkLoaded>
    </>
  );
};

export default Home;
