"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/");
  }

  async function signup() {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    // Create profile entry
    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: email,
        role: "staff",
      });
    }

    alert("Account created successfully");
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-[#1F5E3B] mb-6 text-center">
          SHREE MAHANTESHWARA TRADERS
        </h1>

        <p className="text-center text-gray-600 mb-6">
          ERP Login Portal
        </p>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-xl mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-xl mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full bg-[#1F5E3B] text-white py-3 rounded-xl mb-3"
        >
          Login
        </button>

        <button
          onClick={signup}
          className="w-full bg-blue-600 text-white py-3 rounded-xl"
        >
          Create Account
        </button>
      </div>
    </div>
  );
}