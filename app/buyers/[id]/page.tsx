"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function BuyerStatement({
  params,
}: {
  params: { id: string };
}) {
  const [buyer, setBuyer] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    loadPayments();
  }, []);

  async function loadData() {
    setLoading(true);

    const { data: buyerData } = await supabase
      .from("buyers")
      .select("*")
      .eq("id", params.id)
      .single();

    setBuyer(buyerData);

    const { data: txData } = await supabase
      .from("transactions")
      .select(`
        *,
        farmers(name)
      `)
      .eq("buyer_id", params.id)
      .order("created_at", {
        ascending: false,
      });

    setTransactions(txData || []);
    setLoading(false);
  }

  async function loadPayments() {
    const { data } = await supabase
      .from("buyer_payments")
      .select("*")
      .eq("buyer_id", params.id)
      .order("payment_date", {
        ascending: false,
      });

    setPayments(data || []);
  }

  const totalPurchase = transactions.reduce(
    (sum, t) =>
      sum + Number(t.total_amount || 0),
    0
  );

  const totalPayments = payments.reduce(
    (sum, p) =>
      sum + Number(p.amount || 0),
    0
  );

  const outstanding =
    totalPurchase - totalPayments;

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

        {/* Buyer Info */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-[#1F5E3B]">
            🛒 Buyer Statement
          </h1>

          {buyer && (
            <div className="mt-4 space-y-2">
              <p>
                <strong>Name:</strong>{" "}
                {buyer.name}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {buyer.phone}
              </p>

              <p>
                <strong>Address:</strong>{" "}
                {buyer.address || "-"}
              </p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="bg-green-100 rounded-3xl p-6 shadow">
            <h3>Total Purchase</h3>
            <p className="text-3xl font-bold text-green-700">
              ₹ {totalPurchase.toFixed(2)}
            </p>
          </div>

          <div className="bg-blue-100 rounded-3xl p-6 shadow">
            <h3>Payments</h3>
            <p className="text-3xl font-bold text-blue-700">
              ₹ {totalPayments.toFixed(2)}
            </p>
          </div>

          <div className="bg-red-100 rounded-3xl p-6 shadow">
            <h3>Outstanding</h3>
            <p className="text-3xl font-bold text-red-700">
              ₹ {outstanding.toFixed(2)}
            </p>
          </div>

        </div>

        {/* Transactions */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8">

          <div className="p-5 border-b">
            <h2 className="text-2xl font-bold text-[#1F5E3B]">
              Purchase History
            </h2>
          </div>

          <table className="w-full">
            <thead className="bg-[#1F5E3B] text-white">
              <tr>
                <th className="p-4 text-left">
                  Farmer
                </th>

                <th className="p-4 text-left">
                  Crop
                </th>

                <th className="p-4 text-left">
                  Qty
                </th>

                <th className="p-4 text-left">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((t) => (
                <tr
                  key={t.id}
                  className="border-b"
                >
                  <td className="p-4">
                    {t.farmers?.name}
                  </td>

                  <td className="p-4">
                    {t.crop_name}
                  </td>

                  <td className="p-4">
                    {t.quantity}
                  </td>

                  <td className="p-4 font-bold text-green-700">
                    ₹ {t.total_amount}
                  </td>
                </tr>
              ))}

              {transactions.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center p-8 text-gray-500"
                  >
                    No purchases found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

        </div>

        {/* Payment History */}
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

                  <td className="p-4 font-bold text-green-700">
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