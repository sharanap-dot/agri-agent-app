"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function BuyersPage() {
  const [buyers, setBuyers] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadBuyers();
  }, []);

  async function loadBuyers() {
    const { data, error } = await supabase
      .from("buyers")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      alert(error.message);
      return;
    }

    setBuyers(data || []);
  }

  async function saveBuyer() {
    if (!name || !phone) {
      alert("Please enter buyer name and phone");
      return;
    }

    const { error } = await supabase
      .from("buyers")
      .insert([
        {
          name,
          phone,
          address,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Buyer saved successfully");

    setName("");
    setPhone("");
    setAddress("");

    loadBuyers();
  }

  async function deleteBuyer(id: string) {
    if (!confirm("Delete this buyer?")) return;

    const { error } = await supabase
      .from("buyers")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadBuyers();
  }

  const filteredBuyers = buyers.filter(
    (buyer) =>
      buyer.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      buyer.phone
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      buyer.address
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F7F4] p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-[#1F5E3B]">
            🛒 Buyers Management
          </h1>

          <p className="text-gray-600 mt-2">
            Manage buyers and traders
          </p>
        </div>

        {/* Add Buyer Form */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">

            <input
              type="text"
              placeholder="Buyer Name"
              className="border rounded-xl p-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Phone Number"
              className="border rounded-xl p-3"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <input
              type="text"
              placeholder="Address"
              className="border rounded-xl p-3"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

          </div>

          <button
            onClick={saveBuyer}
            className="mt-6 bg-[#1F5E3B] text-white px-6 py-3 rounded-2xl hover:bg-green-800"
          >
            Save Buyer
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-3xl shadow-lg p-5 mb-8">
          <input
            type="text"
            placeholder="🔍 Search buyer..."
            className="w-full border rounded-xl p-3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Buyers Table */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <table className="w-full">

            <thead className="bg-[#1F5E3B] text-white">
              <tr>
                <th className="p-4 text-left">
                  Name
                </th>

                <th className="p-4 text-left">
                  Phone
                </th>

                <th className="p-4 text-left">
                  Address
                </th>

                <th className="p-4 text-left">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredBuyers.map((buyer) => (
                <tr
                  key={buyer.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4 font-medium">
                    {buyer.name}
                  </td>

                  <td className="p-4">
                    {buyer.phone}
                  </td>

                  <td className="p-4">
                    {buyer.address || "-"}
                  </td>

                  <td className="p-4 flex gap-2">

                    <Link
                      href={`/buyers/${buyer.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                      View
                    </Link>

                    <button
                      onClick={() =>
                        deleteBuyer(buyer.id)
                      }
                      className="bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>

                  </td>
                </tr>
              ))}

              {filteredBuyers.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center p-8 text-gray-500"
                  >
                    No buyers found
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