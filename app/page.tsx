"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  Users,
  ShoppingCart,
  ArrowLeftRight,
  Package,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    checkCompany();
  }, []);

  async function checkCompany() {
    const { data, error } = await supabase
      .from("company")
      .select("*")
      .limit(1)
      .single();

    if (error || !data) {
      router.push("/setup");
      return;
    }

    setCompany(data);
  }

  const stats = [
    {
      title: "Farmers",
      value: 0,
      href: "/farmers",
      color: "bg-green-100 text-green-700",
      icon: <Users size={28} />,
    },
    {
      title: "Buyers",
      value: 0,
      href: "/buyers",
      color: "bg-blue-100 text-blue-700",
      icon: <ShoppingCart size={28} />,
    },
    {
      title: "Transactions",
      value: 0,
      href: "/transactions",
      color: "bg-purple-100 text-purple-700",
      icon: <ArrowLeftRight size={28} />,
    },
    {
      title: "Inventory",
      value: 0,
      href: "/inventory",
      color: "bg-yellow-100 text-yellow-700",
      icon: <Package size={28} />,
    },
  ];

  return (
    <div className="p-4 md:p-8 min-h-screen bg-[#F8F7F4]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-6xl font-bold text-[#1F5E3B]">
          {company?.company_name || "Company Name"}
        </h1>

        <p className="mt-2 text-lg md:text-2xl text-gray-600">
          Agricultural Commission ERP Dashboard
        </p>

        <div className="mt-3 text-gray-700 space-y-1">
          <p>
            <strong>Owner:</strong>{" "}
            {company?.owner_name || "-"}
          </p>

          <p>
            <strong>Phone:</strong>{" "}
            {company?.phone || "-"}
          </p>

          <p>
            <strong>Address:</strong>{" "}
            {company?.address || "-"}
          </p>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`${item.color} rounded-3xl shadow-md p-6 block cursor-pointer transition-transform hover:scale-105 active:scale-95`}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg md:text-xl font-semibold">
                {item.title}
              </h2>

              {item.icon}
            </div>

            <p className="text-4xl md:text-5xl font-bold mt-4">
              {item.value}
            </p>
          </Link>
        ))}

        {/* Total Sales */}
        <div className="bg-red-100 text-red-700 rounded-3xl shadow-md p-6">
          <h2 className="text-lg md:text-xl font-semibold">
            Total Sales
          </h2>

          <p className="text-2xl md:text-4xl font-bold mt-4 break-all">
            ₹ 0.00
          </p>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="mt-10 bg-white rounded-3xl shadow-md p-6">
        <h2 className="text-2xl md:text-4xl font-bold text-[#1F5E3B] mb-6">
          Monthly Sales
        </h2>

        <div className="h-72 flex items-center justify-center text-gray-400">
          Sales Chart Here
        </div>
      </div>
    </div>
  );
}