"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ReportsPage() {
  const [farmers, setFarmers] = useState(0);
  const [buyers, setBuyers] = useState(0);
  const [transactions, setTransactions] =
    useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { count: farmerCount } =
      await supabase
        .from("farmers")
        .select("*", {
          count: "exact",
          head: true,
        });

    const { count: buyerCount } =
      await supabase
        .from("buyers")
        .select("*", {
          count: "exact",
          head: true,
        });

    const { data: txData } =
      await supabase
        .from("transactions")
        .select("*");

    setFarmers(farmerCount || 0);
    setBuyers(buyerCount || 0);
    setTransactions(txData || []);
  }

  const totalSales =
    transactions.reduce(
      (sum, t) =>
        sum +
        Number(
          t.total_amount || 0
        ),
      0
    );

  const totalCommission =
    transactions.reduce(
      (sum, t) =>
        sum +
        Number(
          t.commission || 0
        ),
      0
    );

  return (
    <div className="min-h-screen bg-[#F8F7F4] p-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold text-[#1F5E3B] mb-2">
          📊 Reports Dashboard
        </h1>

        <p className="text-gray-600 mb-8">
          Business analytics and reports
        </p>

        <div className="grid md:grid-cols-5 gap-6">

          <div className="bg-white p-6 rounded-3xl shadow">
            <h3 className="text-gray-600">
              Farmers
            </h3>
            <p className="text-4xl font-bold text-green-700">
              {farmers}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
            <h3 className="text-gray-600">
              Buyers
            </h3>
            <p className="text-4xl font-bold text-blue-700">
              {buyers}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
            <h3 className="text-gray-600">
              Transactions
            </h3>
            <p className="text-4xl font-bold text-purple-700">
              {transactions.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
            <h3 className="text-gray-600">
              Total Sales
            </h3>
            <p className="text-3xl font-bold text-green-700">
              ₹ {totalSales.toFixed(2)}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
            <h3 className="text-gray-600">
              Commission
            </h3>
            <p className="text-3xl font-bold text-yellow-700">
              ₹ {totalCommission.toFixed(2)}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}