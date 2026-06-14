"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [farmers, setFarmers] = useState<any[]>([]);
  const [buyers, setBuyers] = useState<any[]>([]);

  const [paymentType, setPaymentType] =
    useState("Farmer");
  const [farmerId, setFarmerId] =
    useState("");
  const [buyerId, setBuyerId] =
    useState("");
  const [amount, setAmount] =
    useState("");
  const [notes, setNotes] =
    useState("");
  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadPayments();
    loadFarmers();
    loadBuyers();
  }, []);

  async function loadPayments() {
    const { data, error } = await supabase
      .from("payments")
      .select(`
        *,
        farmers(name),
        buyers(name)
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.log(error);
      return;
    }

    setPayments(data || []);
  }

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

  async function savePayment() {
    if (!amount) {
      alert("Enter amount");
      return;
    }

    const { error } = await supabase
      .from("payments")
      .insert([
        {
          payment_type:
            paymentType,
          farmer_id:
            paymentType ===
            "Farmer"
              ? farmerId
              : null,
          buyer_id:
            paymentType ===
            "Buyer"
              ? buyerId
              : null,
          amount:
            Number(amount),
          notes,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert(
      "Payment saved successfully"
    );

    setFarmerId("");
    setBuyerId("");
    setAmount("");
    setNotes("");

    loadPayments();
  }

  async function deletePayment(
    id: string
  ) {
    if (
      !confirm(
        "Delete payment?"
      )
    )
      return;

    const { error } =
      await supabase
        .from("payments")
        .delete()
        .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadPayments();
  }

  const filteredPayments =
    payments.filter((p) => {
      const name =
        p.farmers?.name ||
        p.buyers?.name ||
        "";

      return name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        );
    });

  return (
    <div className="min-h-screen bg-[#F8F7F4] p-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold text-[#1F5E3B] mb-2">
          💰 Payments
        </h1>

        <p className="text-gray-600 mb-8">
          Manage farmer and buyer payments
        </p>

        {/* Payment Form */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">

          <div className="grid md:grid-cols-2 gap-4">

            <select
              value={paymentType}
              onChange={(e) =>
                setPaymentType(
                  e.target.value
                )
              }
              className="border rounded-xl p-3"
            >
              <option value="Farmer">
                Farmer
              </option>

              <option value="Buyer">
                Buyer
              </option>
            </select>

            {paymentType ===
            "Farmer" ? (
              <select
                value={farmerId}
                onChange={(e) =>
                  setFarmerId(
                    e.target.value
                  )
                }
                className="border rounded-xl p-3"
              >
                <option value="">
                  Select Farmer
                </option>

                {farmers.map(
                  (f) => (
                    <option
                      key={f.id}
                      value={f.id}
                    >
                      {f.name}
                    </option>
                  )
                )}
              </select>
            ) : (
              <select
                value={buyerId}
                onChange={(e) =>
                  setBuyerId(
                    e.target.value
                  )
                }
                className="border rounded-xl p-3"
              >
                <option value="">
                  Select Buyer
                </option>

                {buyers.map(
                  (b) => (
                    <option
                      key={b.id}
                      value={b.id}
                    >
                      {b.name}
                    </option>
                  )
                )}
              </select>
            )}

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) =>
                setAmount(
                  e.target.value
                )
              }
              className="border rounded-xl p-3"
            />

            <input
              type="text"
              placeholder="Notes"
              value={notes}
              onChange={(e) =>
                setNotes(
                  e.target.value
                )
              }
              className="border rounded-xl p-3"
            />

          </div>

          <button
            onClick={savePayment}
            className="mt-6 bg-[#1F5E3B] text-white px-6 py-3 rounded-2xl"
          >
            Save Payment
          </button>

        </div>

        {/* Search */}
        <div className="bg-white rounded-3xl shadow-lg p-5 mb-8">
          <input
            type="text"
            placeholder="🔍 Search payment..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full border rounded-xl p-3"
          />
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

          <table className="w-full">

            <thead className="bg-[#1F5E3B] text-white">
              <tr>
                <th className="p-4">
                  Type
                </th>

                <th className="p-4">
                  Name
                </th>

                <th className="p-4">
                  Amount
                </th>

                <th className="p-4">
                  Date
                </th>

                <th className="p-4">
                  Notes
                </th>

                <th className="p-4">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredPayments.map(
                (payment) => (
                  <tr
                    key={
                      payment.id
                    }
                    className="border-b"
                  >
                    <td className="p-4">
                      {
                        payment.payment_type
                      }
                    </td>

                    <td className="p-4">
                      {payment
                        .farmers
                        ?.name ||
                        payment
                          .buyers
                          ?.name}
                    </td>

                    <td className="p-4 font-bold text-green-700">
                      ₹
                      {payment.amount}
                    </td>

                    <td className="p-4">
                      {
                        payment.payment_date
                      }
                    </td>

                    <td className="p-4">
                      {payment.notes ||
                        "-"}
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() =>
                          deletePayment(
                            payment.id
                          )
                        }
                        className="bg-red-600 text-white px-3 py-2 rounded-lg"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )}

              {filteredPayments.length ===
                0 && (
                <tr>
                  <td
                    colSpan={6}
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

    