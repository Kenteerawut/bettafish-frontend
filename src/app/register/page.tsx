"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("Password not match");
      return;
    }

    try {
      setLoading(true);

      // mock register (ใส่ API จริงทีหลัง)
      await new Promise((r) => setTimeout(r, 1000));

      alert("Register success");
      router.push("/login");
    } catch (err) {
      console.error(err);
      alert("Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full flex justify-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-6 space-y-4"
      >
        <h1 className="text-xl font-semibold text-center text-white">
          Register
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-3 rounded-lg text-black"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white font-medium transition-all ${
            loading
              ? "bg-emerald-300"
              : `bg-gradient-to-r from-emerald-400 to-teal-300
                 shadow-[0_0_25px_rgba(16,185,129,0.6)]
                 hover:scale-[1.02]`
          }`}
        >
          {loading ? "Loading..." : "Register"}
        </button>

        {/* Footer */}
        <div className="text-center text-sm text-emerald-100/70">
          มีบัญชีแล้ว?{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-emerald-300 hover:underline"
          >
            เข้าสู่ระบบ
          </button>
        </div>
      </form>
    </section>
  );
}