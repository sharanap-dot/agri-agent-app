"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    checkCompany();
  }, []);

  async function checkCompany() {
    const { data, error } = await supabase
      .from("company")
      .select("*")
      .limit(1);

    if (error) {
      console.error(error);
      return;
    }

    // No company setup yet
    if (!data || data.length === 0) {
      router.replace("/setup");
    } else {
      // Company exists -> Open Dashboard
      router.replace("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F7F4]">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#1F5E3B]">
          AgriLedger ERP
        </h2>
        <p className="text-gray-600 mt-2">
          Loading...
        </p>
      </div>
    </div>
  );
}