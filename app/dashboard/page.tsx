"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [company, setCompany] = useState("AgriLedger ERP");
  const [farmers, setFarmers] = useState(0);
  const [buyers, setBuyers] = useState(0);
  const [transactions, setTransactions] = useState(0);
  const [inventory, setInventory] = useState(0);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const { data: companyData } = await supabase
      .from("company")
      .select("*")
      .limit(1)
      .single();

    if (companyData) {
      setCompany(companyData.name);
    }

    const { count: farmerCount } = await supabase
      .from("farmers")
      .select("*", { count: "exact", head: true });

    const { count: buyerCount } = await supabase
      .from("buyers")
      .select("*", { count: "exact", head: true });

    const { count: transactionCount } = await supabase
      .from("transactions")
      .select("*", { count: "exact", head: true });

    const { count: inventoryCount } = await supabase
      .from("inventory")
      .select("*", { count: "exact", head: true });

    setFarmers(farmerCount || 0);
    setBuyers(buyerCount || 0);
    setTransactions(transactionCount || 0);
    setInventory(inventoryCount || 0);
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl md:text-6xl font-bold text-[#1F5E3B]">
          {company}
        </h1>

        <p className="text-gray-600 mt-2 mb-8 text-lg">
          Agricultural Commission ERP Dashboard
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

          <Link
            href="/farmers"
            className="bg-green-100 rounded-3xl p-6 shadow"
          >
            <h3 className="text-green-800 font-bold text-xl">
              Farmers
            </h3>

            <p className="text-4xl font-bold text-green-700 mt-4">
              {farmers}
            </p>
          </Link>

          <Link
            href="/buyers"
            className="bg-blue-100 rounded-3xl p-6 shadow"
          >
            <h3 className="text-blue-800 font-bold text-xl">
              Buyers
            </h3>

            <p className="text-4xl font-bold text-blue-700 mt-4">
              {buyers}
            </p>
          </Link>

          <Link
            href="/transactions"
            className="bg-purple-100 rounded-3xl p-6 shadow"
          >
            <h3 className="text-purple-800 font-bold text-xl">
              Transactions
            </h3>

            <p className="text-4xl font-bold text-purple-700 mt-4">
              {transactions}
            </p>
          </Link>

          <Link
            href="/inventory"
            className="bg-yellow-100 rounded-3xl p-6 shadow"
          >
            <h3 className="text-yellow-800 font-bold text-xl">
              Inventory
            </h3>

            <p className="text-4xl font-bold text-yellow-700 mt-4">
              {inventory}
            </p>
          </Link>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">

          <h2 className="text-3xl font-bold text-[#1F5E3B] mb-6">
            Quick Actions
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

            <Link
              href="/farmers"
              className="bg-[#1F5E3B] text-white p-5 rounded-2xl text-center"
            >
              Add Farmer
            </Link>

            <Link
              href="/buyers"
              className="bg-[#1F5E3B] text-white p-5 rounded-2xl text-center"
            >
              Add Buyer
            </Link>

            <Link
              href="/transactions"
              className="bg-[#1F5E3B] text-white p-5 rounded-2xl text-center"
            >
              New Transaction
            </Link>

            <Link
              href="/inventory"
              className="bg-[#1F5E3B] text-white p-5 rounded-2xl text-center"
            >
              Manage Inventory
            </Link>

            <Link
              href="/reports"
              className="bg-[#1F5E3B] text-white p-5 rounded-2xl text-center"
            >
              Reports
            </Link>

            <Link
              href="/company"
              className="bg-[#1F5E3B] text-white p-5 rounded-2xl text-center"
            >
              Company Settings
            </Link>

          </div>

        </div>

      </div>
    </div>
  );
}