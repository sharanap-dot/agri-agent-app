"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function FarmerLedgerPage() {
  const params = useParams();
  const farmerId = params.id as string;

  const [ledger, setLedger] = useState<any[]>([]);
  const [description, setDescription] = useState("");
  const [debit, setDebit] = useState("");
  const [credit, setCredit] = useState("");

  useEffect(() => {
    loadLedger();
  }, []);

  async function loadLedger() {
    const { data, error } = await supabase
      .from("farmer_ledger")
      .select("*")
      .eq("farmer_id", farmerId)
      .order("transaction_date", {
        ascending: false,
      });

    if (error) {
      alert(error.message);
      return;
    }

    setLedger(data || []);
  }

  async function addEntry() {
    const { error } = await supabase
      .from("farmer_ledger")
      .insert([
        {
          farmer_id: farmerId,
          description,
          debit: Number(debit || 0),
          credit: Number(credit || 0),
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    setDescription("");
    setDebit("");
    setCredit("");

    loadLedger();
  }

  const totalDebit = ledger.reduce(
    (sum, item) => sum + Number(item.debit || 0),
    0
  );

  const totalCredit = ledger.reduce(
    (sum, item) => sum + Number(item.credit || 0),
    0
  );

  const balance = totalDebit - totalCredit;

  return (
    <div className="min-h-screen bg-[#F8F7F4] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl md:text-5xl font-bold text-[#1F5E3B] mb-6">
          Farmer Ledger
        </h1>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

          <div className="bg-white p-6 rounded-3xl shadow">
            <h3>Total Purchase</h3>
            <p className="text-3xl font-bold text-red-600">
              ₹ {totalDebit.toFixed(2)}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
            <h3>Total Payment</h3>
            <p className="text-3xl font-bold text-green-600">
              ₹ {totalCredit.toFixed(2)}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
            <h3>Balance Due</h3>
            <p className="text-3xl font-bold text-blue-600">
              ₹ {balance.toFixed(2)}
            </p>
          </div>

        </div>

        {/* Add Entry */}
        <div className="bg-white p-6 rounded-3xl shadow mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="border rounded-xl p-3"
            />

            <input
              type="number"
              placeholder="Debit"
              value={debit}
              onChange={(e) =>
                setDebit(e.target.value)
              }
              className="border rounded-xl p-3"
            />

            <input
              type="number"
              placeholder="Credit"
              value={credit}
              onChange={(e) =>
                setCredit(e.target.value)
              }
              className="border rounded-xl p-3"
            />

          </div>

          <button
            onClick={addEntry}
            className="mt-4 bg-[#1F5E3B] text-white px-6 py-3 rounded-2xl"
          >
            Add Entry
          </button>
        </div>

        {/* Ledger Table */}
        <div className="bg-white rounded-3xl shadow overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-[#1F5E3B] text-white">
              <tr>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-left">Debit</th>
                <th className="p-4 text-left">Credit</th>
              </tr>
            </thead>

            <tbody>
              {ledger.map((item) => (
                <tr
                  key={item.id}
                  className="border-b"
                >
                  <td className="p-4">
                    {item.transaction_date}
                  </td>

                  <td className="p-4">
                    {item.description}
                  </td>

                  <td className="p-4 text-red-600">
                    ₹ {Number(item.debit).toFixed(2)}
                  </td>

                  <td className="p-4 text-green-600">
                    ₹ {Number(item.credit).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}