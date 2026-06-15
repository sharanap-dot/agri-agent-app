"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function FarmersPage() {
  const [farmers, setFarmers] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [village, setVillage] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadFarmers();
  }, []);

  async function loadFarmers() {
    const { data, error } = await supabase
      .from("farmers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setFarmers(data || []);
  }

  async function saveFarmer() {
    if (!name || !phone || !village) {
      alert("Please fill all fields");
      return;
    }

    const { error } = await supabase
      .from("farmers")
      .insert([
        {
          name,
          phone,
          village,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Farmer added successfully");

    setName("");
    setPhone("");
    setVillage("");

    loadFarmers();
  }

  async function deleteFarmer(id: string) {
    if (!confirm("Delete farmer?")) return;

    const { error } = await supabase
      .from("farmers")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadFarmers();
  }

  const filteredFarmers = farmers.filter((farmer) =>
    farmer.name?.toLowerCase().includes(search.toLowerCase()) ||
    farmer.village?.toLowerCase().includes(search.toLowerCase()) ||
    farmer.phone?.includes(search)
  );

  return (
    <div className="min-h-screen bg-[#F8F7F4] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl md:text-5xl font-bold text-[#1F5E3B] mb-2">
          👨‍🌾 Farmers Registry
        </h1>

        <p className="text-gray-600 mb-8">
          Manage farmers and their ledgers
        </p>

        {/* Add Farmer */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <input
              type="text"
              placeholder="Farmer Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-xl p-3"
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border rounded-xl p-3"
            />

            <input
              type="text"
              placeholder="Village"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              className="border rounded-xl p-3"
            />

          </div>

          <button
            onClick={saveFarmer}
            className="mt-6 bg-[#1F5E3B] text-white px-6 py-3 rounded-2xl"
          >
            Add Farmer
          </button>

        </div>

        {/* Search */}
        <div className="bg-white rounded-3xl shadow-lg p-5 mb-8">

          <input
            type="text"
            placeholder="🔍 Search farmer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-xl p-3"
          />

        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">

          {filteredFarmers.map((farmer) => (
            <div
              key={farmer.id}
              className="bg-white rounded-3xl shadow-lg p-5"
            >
              <h2 className="text-xl font-bold text-[#1F5E3B]">
                {farmer.name}
              </h2>

              <p className="text-gray-600 mt-2">
                📞 {farmer.phone}
              </p>

              <p className="text-gray-600">
                📍 {farmer.village}
              </p>

              <div className="flex gap-2 mt-4">

                <Link
                  href={`/farmers/${farmer.id}/ledger`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Ledger
                </Link>

                <button
                  onClick={() => deleteFarmer(farmer.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Delete
                </button>

              </div>
            </div>
          ))}

        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-3xl shadow-lg overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead className="bg-[#1F5E3B] text-white">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Village</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredFarmers.map((farmer) => (
                <tr
                  key={farmer.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4">{farmer.name}</td>

                  <td className="p-4">{farmer.phone}</td>

                  <td className="p-4">{farmer.village}</td>

                  <td className="p-4 flex gap-2">

                    <Link
                      href={`/farmers/${farmer.id}/ledger`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                      Ledger
                    </Link>

                    <button
                      onClick={() => deleteFarmer(farmer.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              ))}

              {filteredFarmers.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center p-8 text-gray-500"
                  >
                    No farmers found
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