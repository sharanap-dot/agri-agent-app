"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SetupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  async function saveCompany() {
    if (!name) {
      alert("Enter company name");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("company")
      .insert([
        {
          name,
          owner_name: ownerName,
          phone,
          address,
        },
      ]);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Company created successfully");

    router.push("/");
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-2xl">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#1F5E3B]">
            Welcome to AgriLedger ERP
          </h1>

          <p className="text-gray-600 mt-3">
            Set up your trading company
          </p>
        </div>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Company Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="w-full border rounded-2xl p-4"
          />

          <input
            type="text"
            placeholder="Owner Name"
            value={ownerName}
            onChange={(e) =>
              setOwnerName(e.target.value)
            }
            className="w-full border rounded-2xl p-4"
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
            className="w-full border rounded-2xl p-4"
          />

          <textarea
            placeholder="Company Address"
            value={address}
            onChange={(e) =>
              setAddress(e.target.value)
            }
            className="w-full border rounded-2xl p-4 h-28"
          />

          <button
            onClick={saveCompany}
            disabled={loading}
            className="w-full bg-[#1F5E3B] text-white py-4 rounded-2xl text-lg font-semibold hover:bg-green-800"
          >
            {loading
              ? "Creating..."
              : "Create Company"}
          </button>

        </div>

      </div>
    </div>
  );
}