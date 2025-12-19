"use client";

// import Link from "next/link";

type BalanceCardProps = {
  balance: number; // 例: 950000
};

export default function BalanceCard({ balance }: BalanceCardProps) {
  return (
    // <Link href="/history" className="block cursor-pointer transition-transform active:scale-95">
    <div className="w-full rounded-cloud bg-white/80 shadow-soft px-6 py-5 text-center backdrop-blur">
      {/* ラベル */}
      <p className="mb-2 text-sm font-semibold text-oshi-main">
        現在の推し活残高
      </p>

      {/* 金額 */}
      <p className="text-3xl font-bold text-oshi-text">
        ¥ {balance.toLocaleString()}
      </p>

      {/* 補足 */}
      <p className="mt-1 text-xs text-gray-500">sunabar（銀行API実験場）</p>
    </div>
    // </Link>
  );
}
