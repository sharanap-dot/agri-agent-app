"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [cropName, setCropName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("Quintal");

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      alert(error.message);
      return;
    }

    setInventory(data || []);
  }

  async function saveInventory() {
    if (!cropName || !quantity) {
      alert("Please fill all fields");
      return;
    }

    const { error } = await supabase
      .from("inventory")
      .insert([
        {
          crop_name: cropName,
          quantity: Number(quantity),
          unit,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Stock added successfully");

    setCropName("");
    setQuantity("");
    setUnit("Quintal");

    loadInventory();
  }

  async function deleteInventory(id: string) {
    if (!confirm("Delete stock?")) return;

    const { error } = await supabase
      .from("inventory")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadInventory();
  }

  const filteredInventory = inventory.filter(
    (item) =>
      item.crop_name
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  const totalStock = inventory.reduce(
    (sum, item) =>
      sum + Number(item.quantity || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#F8F7F4] p-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold text-[#1F5E3B] mb-2">
          📦 Inventory Management
        </h1>

        <p className="text-gray-600 mb-8">
          Manage crop stock
        </p>

        {/* Summary */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">

          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="text-gray-600">
              Total Items
            </h3>

            <p className="text-4xl font-bold text-[#1F5E3B]">
              {inventory.length}
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="text-gray-600">
              Total Stock
            </h3>

            <p className="text-4xl font-bold text-green-700">
              {totalStock}
            </p>
          </div>

        </div>

        {/* Add Stock */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">

          <div className="grid md:grid-cols-3 gap-4">

            <input
              type="text"
              placeholder="Crop Name"
              value={cropName}
              onChange={(e) =>
                setCropName(e.target.value)
              }
              className="border rounded-xl p-3"
            />

            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value)
              }
              className="border rounded-xl p-3"
            />

            <select
              value={unit}
              onChange={(e) =>
                setUnit(e.target.value)
              }
              className="border rounded-xl p-3"
            >
              <option>
                Quintal
              </option>

              <option>
                KG
              </option>

              <option>
                Bags
              </option>
            </select>

          </div>

          <button
            onClick={saveInventory}
            className="mt-6 bg-[#1F5E3B] text-white px-6 py-3 rounded-2xl"
          >
            Add Stock
          </button>

        </div>

        {/* Search */}
        <div className="bg-white rounded-3xl shadow-lg p-5 mb-8">

          <input
            type="text"
            placeholder="🔍 Search crop..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full border rounded-xl p-3"
          />

        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

          <table className="w-full">

            <thead className="bg-[#1F5E3B] text-white">
              <tr>
                <th className="p-4 text-left">
                  Crop
                </th>

                <th className="p-4 text-left">
                  Quantity
                </th>

                <th className="p-4 text-left">
                  Unit
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredInventory.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4 font-medium">
                    {item.crop_name}
                  </td>

                  <td className="p-4">
                    {item.quantity}
                  </td>

                  <td className="p-4">
                    {item.unit}
                  </td>

                  <td className="p-4">
                    {Number(item.quantity) < 10 ? (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
                        Low Stock
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                        In Stock
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() =>
                        deleteInventory(item.id)
                      }
                      className="bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}

              {filteredInventory.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center p-8 text-gray-500"
                  >
                    No inventory found
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