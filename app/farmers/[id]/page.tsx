"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { generateFarmerStatement } from "@/utils/generateFarmerStatement";

export default function FarmerStatement({
  params,
}: {
  params: { id: string };
}) {
  const [farmer, setFarmer] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    loadPayments();
  }, []);

  async function loadData() {
    setLoading(true);

    // Farmer
    const { data: farmerData } = await supabase
      .from("farmers")
      .select("*")
      .eq("id", params.id)
      .single();

    setFarmer(farmerData);

    // Transactions
    const { data: txData } = await supabase
      .from("transactions")
      .select(`
        *,
        buyers(name)
      `)
      .eq("farmer_id", params.id)
      .order("created_at", {
        ascending: false,
      });

    setTransactions(txData || []);

    setLoading(false);
  }

  async function loadPayments() {
    const { data } = await supabase
      .from("payments")
      .select("*")
      .eq("farmer_id", params.id)
      .order("payment_date", {
        ascending: false,
      });

    setPayments(data || []);
  }

  const totalSales = transactions.reduce(
    (sum, t) => sum + Number(t.total_amount || 0),
    0
  );

  const totalCommission = transactions.reduce(
    (sum, t) => sum + Number(t.commission_amount || 0),
    0
  );

  const totalNet = transactions.reduce(
    (sum, t) => sum + Number(t.net_amount || 0),
    0
  );

  const totalPayments = payments.reduce(
    (sum, p) => sum + Number(p.amount || 0),
    0
  );

  const outstandingBalance =
    totalNet - totalPayments;

  if (loading) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] p-8">
      <div className="max-w-7xl mx-auto">

        {/* Farmer Details */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">

          <div className="flex justify-between items-center">

            <div>
              <h1 className="text-4xl font-bold text-[#1F5E3B]">
                🌾 Farmer Statement
              </h1>

              {farmer && (
                <div className="mt-5 space-y-2 text-lg">
                  <p>
                    <strong>Name:</strong>{" "}
                    {farmer.name}
                  </p>

                  <p>
                    <strong>Phone:</strong>{" "}
                    {farmer.phone || "-"}
                  </p>

                  <p>
                    <strong>Village:</strong>{" "}
                    {farmer.village || "-"}
                  </p>
                </div>
              )}
            </div>

            {farmer && (
              <button
                onClick={() =>
                  generateFarmerStatement(
                    farmer,
                    transactions
                  )
                }
                className="bg-[#1F5E3B] text-white px-6 py-3 rounded-2xl shadow hover:bg-green-800"
              >
                📄 Download PDF
              </button>
            )}

          </div>
        </div>

        {/* Summary */}
        <div className="grid md:grid-cols-5 gap-5 mb-8">

          <div className="bg-green-100 p-6 rounded-3xl shadow">
            <h3>Total Sales</h3>
            <p className="text-2xl font-bold text-green-700">
              ₹ {totalSales.toFixed(2)}
            </p>
          </div>

          <div className="bg-yellow-100 p-6 rounded-3xl shadow">
            <h3>Commission</h3>
            <p className="text-2xl font-bold text-yellow-700">
              ₹ {totalCommission.toFixed(2)}
            </p>
          </div>

          <div className="bg-blue-100 p-6 rounded-3xl shadow">
            <h3>Net Amount</h3>
            <p className="text-2xl font-bold text-blue-700">
              ₹ {totalNet.toFixed(2)}
            </p>
          </div>

          <div className="bg-purple-100 p-6 rounded-3xl shadow">
            <h3>Payments</h3>
            <p className="text-2xl font-bold text-purple-700">
              ₹ {totalPayments.toFixed(2)}
            </p>
          </div>

          <div className="bg-red-100 p-6 rounded-3xl shadow">
            <h3>Outstanding</h3>
            <p className="text-2xl font-bold text-red-700">
              ₹ {outstandingBalance.toFixed(2)}
            </p>
          </div>

        </div>

        {/* Transactions */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8">

          <div className="p-5 border-b">
            <h2 className="text-2xl font-bold text-[#1F5E3B]">
              Transaction History
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">

              <thead className="bg-[#1F5E3B] text-white">
                <tr>
                  <th className="p-4 text-left">
                    Buyer
                  </th>

                  <th className="p-4 text-left">
                    Crop
                  </th>

                  <th className="p-4 text-left">
                    Qty
                  </th>

                  <th className="p-4 text-left">
                    Rate
                  </th>

                  <th className="p-4 text-left">
                    Total
                  </th>

                  <th className="p-4 text-left">
                    Commission
                  </th>

                  <th className="p-4 text-left">
                    Net
                  </th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-4">
                      {t.buyers?.name || "-"}
                    </td>

                    <td className="p-4">
                      {t.crop_name}
                    </td>

                    <td className="p-4">
                      {t.quantity}
                    </td>

                    <td className="p-4">
                      ₹ {t.rate}
                    </td>

                    <td className="p-4">
                      ₹ {t.total_amount}
                    </td>

                    <td className="p-4 text-amber-700">
                      ₹ {t.commission_amount}
                    </td>

                    <td className="p-4 font-bold text-green-700">
                      ₹ {t.net_amount}
                    </td>
                  </tr>
                ))}

                {transactions.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center p-8 text-gray-500"
                    >
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        </div>

        {/* Payments */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

          <div className="p-5 border-b">
            <h2 className="text-2xl font-bold text-[#1F5E3B]">
              Payment History
            </h2>
          </div>

          <table className="w-full">

            <thead className="bg-[#1F5E3B] text-white">
              <tr>
                <th className="p-4 text-left">
                  Date
                </th>

                <th className="p-4 text-left">
                  Amount
                </th>

                <th className="p-4 text-left">
                  Notes
                </th>
              </tr>
            </thead>

            <tbody>
              {payments.map((p) => (
                <tr
                  key={p.id}
                  className="border-b"
                >
                  <td className="p-4">
                    {p.payment_date}
                  </td>

                  <td className="p-4 text-green-700 font-bold">
                    ₹ {p.amount}
                  </td>

                  <td className="p-4">
                    {p.notes || "-"}
                  </td>
                </tr>
              ))}

              {payments.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center p-8 text-gray-500"
                  >
                    No payments found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
}