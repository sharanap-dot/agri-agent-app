"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SetupPage() {
  const router = useRouter();

  const [companyName, setCompanyName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [loading, setLoading] = useState(false);

  async function saveCompany() {
    if (
      !companyName ||
      !ownerName ||
      !phone ||
      !address ||
      !gstNumber
    ) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("company")
      .insert([
        {
          name: companyName,
          owner_name: ownerName,
          phone: phone,
          address: address,
          gst_number: gstNumber,
        },
      ]);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Company saved successfully");

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-2xl">

        <h1 className="text-4xl font-bold text-[#1F5E3B] mb-2">
          Company Setup
        </h1>

        <p className="text-gray-500 mb-8">
          Enter company details before using AgriLedger ERP
        </p>

        <input
          type="text"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full border rounded-xl p-4 mb-4"
        />

        <input
          type="text"
          placeholder="Owner Name"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
          className="w-full border rounded-xl p-4 mb-4"
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded-xl p-4 mb-4"
        />

        <textarea
          placeholder="Company Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border rounded-xl p-4 mb-4 h-32"
        />

        <input
          type="text"
          placeholder="GST Number"
          value={gstNumber}
          onChange={(e) => setGstNumber(e.target.value)}
          className="w-full border rounded-xl p-4 mb-6"
        />

        <button
          onClick={saveCompany}
          disabled={loading}
          className="w-full bg-[#1F5E3B] hover:bg-green-800 text-white py-4 rounded-xl font-semibold text-lg"
        >
          {loading ? "Saving..." : "Save & Continue"}
        </button>

      </div>
    </div>
  );
}
