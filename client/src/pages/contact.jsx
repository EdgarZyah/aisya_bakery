import React, { useState } from "react";
import Hero from "../components/hero";
import Button from "../components/common/button";

const subjects = ["General Inquiry", "Order Support", "Feedback", "Other"];

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Pesan dikirim!\n" + JSON.stringify(form, null, 2));
  };

  return (
    <main className="w-full mx-auto">
      <Hero
        title="Hubungi Kami"
        subtitle="Ada pertanyaan atau pesanan khusus? Kami siap membantu Anda."
        ctaText="Kirim Pesan"
        onCtaClick={() => alert("Navigasi ke form kontak")}
      />
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 px-4 py-16">
        <div className="md:w-1/2 flex flex-col justify-center mb-10 md:mb-0">
          <h1 className="text-4xl font-bold mb-2 text-[var(--color-text)]">
            Get In Touch
          </h1>
          <p className="mb-2 text-[var(--color-primary)] font-medium">
            Visit our brand stores!
          </p>
          <p className="text-sm text-[var(--color-text)]">
            Memanfaatkan kerangka kerja tangkas untuk memberikan ringkasan yang
            kuat untuk ikhtisar tingkat tinggi. Pendekatan iteratif terhadap
            strategi perusahaan mendorong pemikiran kolaboratif untuk memajukan
            proposisi nilai secara keseluruhan. Mengembangkan holistik secara
            organik.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="md:w-1/2 flex flex-col gap-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition"
          />
          <div className="flex gap-4">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-1/2 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition"
            />
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-1/2 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition"
            />
          </div>
          <select
            name="subject"
            value={form.subject}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition bg-gray-100"
          >
            <option value="">Subject</option>
            {subjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={5}
            placeholder="Message"
            required
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition"
          />
          <div className="flex justify-end">
            <Button
              variant="primary"
              type="submit"
              className="px-8 py-2 rounded-full shadow"
            >
              Send Message
            </Button>
          </div>
        </form>
      </div>{" "}
    </main>
  );
};

export default Contact;
