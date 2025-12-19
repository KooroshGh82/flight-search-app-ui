"use client";
import { useState } from "react";

type TourResult = {
  rank: number;
  origin: string;
  destination: string;
  price: number;
  airline: string;
  description: string;
  source: string;
  url: string;
};

export default function Home() {
  const [data, setData] = useState<TourResult[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [clicked, setClicked] = useState(false);

  const [query, setQuery] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [airline, setAirline] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const search = async () => {
    setClicked(true);
    const params = new URLSearchParams();

    if (query) params.append("query", query);
    if (origin) params.append("origin", origin);
    if (destination) params.append("destination", destination);
    if (airline) params.append("airline", airline);
    if (maxPrice) params.append("max_price", maxPrice);

    const res = await fetch(
      `http://127.0.0.1:8000/search?${params.toString()}`
    );

    const json = await res.json();
    setData(json);
    setSelected([]);
  };

  const toggleSelect = (rank: number) => {
    setSelected((prev) =>
      prev.includes(rank) ? prev.filter((r) => r !== rank) : [...prev, rank]
    );
  };

  return (
    <div dir="rtl" className="min-h-screen p-6 font-sans text-right">
      <h1 className="text-2xl font-bold mb-6 text-orange-400">
        سامانه جستجوی معنایی تورهای پروازی داخلی
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-6">
        <input
          className="input"
          placeholder="جستجوی معنایی (مثلاً مشهد)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <input
          className="input"
          placeholder="مبدا"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        />
        <input
          className="input"
          placeholder="مقصد"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <input
          className="input"
          placeholder="ایرلاین"
          value={airline}
          onChange={(e) => setAirline(e.target.value)}
        />
        <input
          className="input"
          type="number"
          placeholder="حداکثر قیمت (تومان)"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <button
          onClick={search}
          className="bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          جستجو
        </button>
      </div>

      {clicked &&
        (data.length > 0 ? (
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="w-full text-sm text-right">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-3 text-center">انتخاب</th>
                  <th className="p-3">رتبه</th>
                  <th className="p-3">مسیر</th>
                  <th className="p-3">قیمت (تومان)</th>
                  <th className="p-3">ایرلاین</th>
                  <th className="p-3">بخشی از متن منبع</th>
                  <th className="p-3">منبع</th>
                  <th className="p-3">لینک</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr
                    key={item.rank}
                    className={`border-b hover:bg-gray-50 ${
                      item.rank === 1 ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={selected.includes(item.rank)}
                        onChange={() => toggleSelect(item.rank)}
                      />
                    </td>
                    <td className="p-3 font-bold text-gray-700">{item.rank}</td>
                    <td className="p-3 text-gray-700">
                      {item.origin} به {item.destination}
                    </td>
                    <td className="p-3 text-gray-700">
                      {Number(item.price).toLocaleString()}
                    </td>
                    <td className="p-3 text-gray-700">{item.airline}</td>
                    <td className="p-3 text-gray-700">{item.description}</td>
                    <td className="p-3 text-gray-700">{item.source}</td>
                    <td className="p-3 text-blue-600 underline">
                      <a href={item.url} target="_blank" rel="noreferrer">
                        مشاهده
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-4 text-sm text-gray-600">
              تعداد آیتم‌های انتخاب‌شده: {selected.length}
            </div>
          </div>
        ) : (
          <div>
            <p>نتیجه ای یافت نشد</p>
          </div>
        ))}
    </div>
  );
}
