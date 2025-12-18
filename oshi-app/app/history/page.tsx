"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CloudBackground from "../components/CloudBackground";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch("/api/history")
      .then((res) => res.json())
      .then((data) => setHistory(data.transactions || []));
  }, []);

  return (
    <CloudBackground>
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-oshi-main">入出金明細</h1>
          <Link href="/" className="text-xs text-gray-500 bg-white/50 px-3 py-1 rounded-full shadow-sm">
            戻る
          </Link>
        </div>

        <div className="bg-white/80 rounded-cloud p-4 shadow-soft">
          {history.length === 0 ? (
            <p className="text-center text-gray-400 py-10 text-sm">明細がありません</p>
          ) : (
            <div className="flex flex-col gap-4">
              {history.map((item: any, i) => (
                <div key={i} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0">
                  <div className="text-left">
                    <p className="text-[10px] text-gray-400">{item.transactionDate}</p>
                    <p className="text-sm font-semibold text-oshi-text">{item.remarks}</p>
                  </div>
                  <p className={`font-bold ${item.amount < 0 ? "text-red-400" : "text-oshi-main"}`}>
                    {item.amount > 0 ? "+" : ""}{item.amount.toLocaleString()}円
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </CloudBackground>
  );
}