"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CompanyPage() {
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gstNumber, setGstNumber] = useState("");

  useEffect(() => {
    loadCompany();
  }, []);

  async function loadCompany() {
    const { data, error } = await supabase
      .from("company")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      console.log(error.message);
      return;
    }

    if (data) {
      setCompany(data);

      setCompanyName(data.name || "");
      setOwnerName(data.owner_name || "");
      setPhone(data.phone || "");
      setAddress(data.address || "");
      setGstNumber(data.gst_number || "");
    }
  }

  async function updateCompany() {
    if (!company) return;

    setLoading(true);

    const { error } = await supabase
      .from("company")
      .update({
        name: companyName,
        owner_name: ownerName,
        phone: phone,
        address: address,
        gst_number: gstNumber,
      })
      .eq("id", company.id);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Company Updated Successfully");
    loadCompany();
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-8">

        <h1 className="text-4xl font-bold text-[#1F5E3B] mb-2">
          Company Settings
        </h1>

        <p className="text-gray-600 mb-8">
          Manage Company Information
        </p>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full border rounded-xl p-3"
          />

          <input
            type="text"
            placeholder="Owner Name"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            className="w-full border rounded-xl p-3"
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded-xl p-3"
          />

          <textarea
            placeholder="Company Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={4}
            className="w-full border rounded-xl p-3"
          />

          <input
            type="text"
            placeholder="GST Number"
            value={gstNumber}
            onChange={(e) => setGstNumber(e.target.value)}
            className="w-full border rounded-xl p-3"
          />

          <button
            onClick={updateCompany}
            disabled={loading}
            className="w-full bg-[#1F5E3B] text-white py-3 rounded-xl font-semibold"
          >
            {loading ? "Updating..." : "Update Company"}
          </button>

        </div>
      </div>
    </div>
  );
}