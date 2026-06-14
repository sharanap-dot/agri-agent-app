"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TransactionsPage() {
  const [farmers, setFarmers] = useState<any[]>([]);
  const [buyers, setBuyers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  const [selectedFarmer, setSelectedFarmer] = useState("");
  const [selectedBuyer, setSelectedBuyer] = useState("");
  const [cropName, setCropName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [rate, setRate] = useState("");

  useEffect(() => {
    loadFarmers();
    loadBuyers();
    loadTransactions();
  }, []);

  async function loadFarmers() {
    const { data } = await supabase
      .from("farmers")
      .select("*")
      .order("name");

    setFarmers(data || []);
  }

  async function loadBuyers() {
    const { data } = await supabase
      .from("buyers")
      .select("*")
      .order("name");

    setBuyers(data || []);
  }

  async function loadTransactions() {
    const { data } = await supabase
      .from("transactions")
      .select(`
        *,
        farmers(name),
        buyers(name)
      `)
      .order("created_at", {
        ascending: false,
      });

    setTransactions(data || []);
  }

  const total =
    Number(quantity || 0) *
    Number(rate || 0);

  const commission = total * 0.02;
  const netAmount = total - commission;

  async function saveTransaction() {
    if (
      !selectedFarmer ||
      !selectedBuyer ||
      !cropName ||
      !quantity ||
      !rate
    ) {
      alert("Please fill all fields");
      return;
    }

    const qty = Number(quantity);
    const price = Number(rate);

    const totalAmount = qty * price;
    const commissionAmount =
      totalAmount * 0.02;
    const net = totalAmount - commissionAmount;

    // Save transaction
    const { error } = await supabase
      .from("transactions")
      .insert([
        {
          farmer_id: selectedFarmer,
          buyer_id: selectedBuyer,
          crop_name: cropName,
          quantity: qty,
          rate: price,
          total_amount: totalAmount,
          commission: commissionAmount,
          net_amount: net,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    // Update inventory
    const { data: stock } = await supabase
      .from("inventory")
      .select("*")
      .eq("crop_name", cropName)
      .single();

    if (stock) {
      await supabase
        .from("inventory")
        .update({
          quantity:
            Number(stock.quantity) + qty,
        })
        .eq("id", stock.id);
    } else {
      await supabase
        .from("inventory")
        .insert([
          {
            crop_name: cropName,
            quantity: qty,
            unit: "Quintal",
          },
        ]);
    }

    alert("Transaction saved successfully");

    setSelectedFarmer("");
    setSelectedBuyer("");
    setCropName("");
    setQuantity("");
    setRate("");

    loadTransactions();
  }

  async function deleteTransaction(
    id: string
  ) {
    if (
      !confirm(
        "Delete transaction?"
      )
    )
      return;

    const { data: tx } =
      await supabase
        .from("transactions")
        .select("*")
        .eq("id", id)
        .single();

    if (tx) {
      const { data: stock } =
        await supabase
          .from("inventory")
          .select("*")
          .eq(
            "crop_name",
            tx.crop_name
          )
          .single();

      if (stock) {
        await supabase
          .from("inventory")
          .update({
            quantity:
              Number(stock.quantity) -
              Number(tx.quantity),
          })
          .eq("id", stock.id);
      }
    }

    await supabase
      .from("transactions")
      .delete()
      .eq("id", id);

    loadTransactions();
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] p-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold text-[#1F5E3B] mb-2">
          🌾 Transactions Ledger
        </h1>

        <p className="text-gray-600 mb-8">
          Manage crop purchases and commissions
        </p>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">

          <h2 className="text-2xl font-bold mb-6">
            Add Transaction
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <select
              value={selectedFarmer}
              onChange={(e) =>
                setSelectedFarmer(
                  e.target.value
                )
              }
              className="border rounded-xl p-3"
            >
              <option value="">
                Select Farmer
              </option>

              {farmers.map((f) => (
                <option
                  key={f.id}
                  value={f.id}
                >
                  {f.name}
                </option>
              ))}
            </select>

            <select
              value={selectedBuyer}
              onChange={(e) =>
                setSelectedBuyer(
                  e.target.value
                )
              }
              className="border rounded-xl p-3"
            >
              <option value="">
                Select Buyer
              </option>

              {buyers.map((b) => (
                <option
                  key={b.id}
                  value={b.id}
                >
                  {b.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Crop Name"
              value={cropName}
              onChange={(e) =>
                setCropName(
                  e.target.value
                )
              }
              className="border rounded-xl p-3"
            />

            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  e.target.value
                )
              }
              className="border rounded-xl p-3"
            />

            <input
              type="number"
              placeholder="Rate"
              value={rate}
              onChange={(e) =>
                setRate(
                  e.target.value
                )
              }
              className="border rounded-xl p-3"
            />

          </div>

          {/* Calculation Cards */}
          <div className="grid md:grid-cols-3 gap-4 mt-6">

            <div className="bg-green-100 p-5 rounded-2xl">
              <h3>Total</h3>
              <p className="text-3xl font-bold">
                ₹ {total.toFixed(2)}
              </p>
            </div>

            <div className="bg-yellow-100 p-5 rounded-2xl">
              <h3>Commission (2%)</h3>
              <p className="text-3xl font-bold">
                ₹ {commission.toFixed(2)}
              </p>
            </div>

            <div className="bg-blue-100 p-5 rounded-2xl">
              <h3>Net Amount</h3>
              <p className="text-3xl font-bold">
                ₹ {netAmount.toFixed(2)}
              </p>
            </div>

          </div>

          <button
            onClick={saveTransaction}
            className="mt-6 bg-[#1F5E3B] text-white px-6 py-3 rounded-2xl"
          >
            Save Transaction
          </button>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

          <table className="w-full">

            <thead className="bg-[#1F5E3B] text-white">
              <tr>
                <th className="p-4">Farmer</th>
                <th className="p-4">Buyer</th>
                <th className="p-4">Crop</th>
                <th className="p-4">Qty</th>
                <th className="p-4">Rate</th>
                <th className="p-4">Net</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b"
                >
                  <td className="p-4">
                    {tx.farmers?.name}
                  </td>

                  <td className="p-4">
                    {tx.buyers?.name}
                  </td>

                  <td className="p-4">
                    {tx.crop_name}
                  </td>

                  <td className="p-4">
                    {tx.quantity}
                  </td>

                  <td className="p-4">
                    ₹ {tx.rate}
                  </td>

                  <td className="p-4 font-bold text-green-700">
                    ₹ {tx.net_amount}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() =>
                        deleteTransaction(
                          tx.id
                        )
                      }
                      className="bg-red-600 text-white px-3 py-2 rounded-lg"
                    >
                      Delete
                    </button>
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
    </div>
  );
}