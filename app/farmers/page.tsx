"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function FarmersPage() {
  const [farmers, setFarmers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [village, setVillage] = useState("");

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

    alert("Farmer saved successfully");

    setName("");
    setPhone("");
    setVillage("");

    loadFarmers();
  }

  async function deleteFarmer(id: string) {
    const confirmDelete = confirm(
      "Delete this farmer?"
    );

    if (!confirmDelete) return;

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

  const filteredFarmers = farmers.filter(
    (f) =>
      f.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      f.phone
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      f.village
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F7F4] p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-[#1F5E3B]">
            🌾 Farmers Registry
          </h1>

          <p className="text-gray-600 mt-2">
            Manage farmers and their details
          </p>
        </div>

        {/* Add Farmer */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">

          <div className="grid md:grid-cols-3 gap-4">

            <input
              type="text"
              placeholder="Farmer Name"
              className="border rounded-xl p-3"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

            <input
              type="text"
              placeholder="Phone Number"
              className="border rounded-xl p-3"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
            />

            <input
              type="text"
              placeholder="Village"
              className="border rounded-xl p-3"
              value={village}
              onChange={(e) =>
                setVillage(e.target.value)
              }
            />

          </div>

          <button
            onClick={saveFarmer}
            className="mt-6 bg-[#1F5E3B] text-white px-6 py-3 rounded-2xl hover:bg-green-800"
          >
            Save Farmer
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-3xl shadow-lg p-5 mb-8">
          <input
            type="text"
            placeholder="🔍 Search farmer..."
            className="w-full border rounded-xl p-3"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        {/* Farmers Table */}
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
                  Village
                </th>

                <th className="p-4 text-left">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredFarmers.map((farmer) => (
                <tr
                  key={farmer.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4 font-medium">
                    {farmer.name}
                  </td>

                  <td className="p-4">
                    {farmer.phone}
                  </td>

                  <td className="p-4">
                    {farmer.village}
                  </td>

                  <td className="p-4 flex gap-2">

                    <Link
                      href={`/farmers/${farmer.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                      View
                    </Link>

                    <button
                      onClick={() =>
                        deleteFarmer(farmer.id)
                      }
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