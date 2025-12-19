"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CloudBackground from "../components/CloudBackground";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/history")
      .then((res) => res.json())
      .then((data) => {
        const transactions = data.transactions || [];
        
        // 💡 ロジック：送金の「直前」にある同額の振替（内部移動）を非表示にする
        const filtered: any[] = [];
        
        for (let i = 0; i < transactions.length; i++) {
          const current = transactions[i];
          const next = transactions[i + 1];

          // 判定：
          // 1. 現在の行が「振替」による入金である
          // 2. 次の行が存在し、かつ「スナバ」または「振込」名義の出金である
          // 3. その2つの金額（絶対値）が完全に一致する
          const isInternalTransfer = 
            current.remarks?.includes("振替") && 
            current.amount > 0 &&
            next && 
            (next.remarks?.includes("スナバ") || next.remarks?.includes("振込")) &&
            Math.abs(current.amount) === Math.abs(next.amount);

          if (isInternalTransfer) {
            console.log(`🚫 送金直前の内部振替を非表示にしました: ${current.amount}円`);
            continue; 
          }

          filtered.push(current);
        }

        // 最新順に並び替えてセット
        setHistory([...filtered].reverse());
      });
  }, []);

  return (
    <CloudBackground>
      <div className="max-w-md mx-auto px-2">
        <div className="flex justify-between items-end mb-4 px-1">
          <div>
            <h1 className="text-xl font-black text-oshi-main tracking-tighter">
              推しへの想いの軌跡
            </h1>
            <p className="text-[10px] text-oshi-main/60 font-bold uppercase">
              My Devotion History
            </p>
          </div>
          <Link 
            href="/" 
            className="text-[10px] text-gray-500 bg-white/70 px-4 py-1.5 rounded-full shadow-sm hover:bg-white transition-all active:scale-95"
          >
            戻る
          </Link>
        </div>

        <div className="bg-white/90 rounded-[2.5rem] p-6 shadow-xl border border-white min-h-[450px]">
          {history.length === 0 ? (
            <div className="flex flex-col items-center py-20">
              <span className="text-4xl mb-4">✨</span>
              <p className="text-center text-gray-400 text-sm italic">
                まだ想いの軌跡がありません。
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {history.map((item: any, i) => {
                const absAmt = Math.abs(item.amount);

                // 💡 修正ポイント：
                // 「金額がマイナス（出金）」かつ「送金関連のキーワードがある」場合のみピンクにする
                // これにより、プラスの「振替（課金）」は水色のままになります
                const isSentToOshi = 
                  item.amount < 0 && 
                  (item.remarks?.includes("スナバ") || item.remarks?.includes("振込"));

                return (
                  <div key={i} className="flex justify-between items-center border-b border-pink-50 pb-4 last:border-0 last:pb-0">
                    <div className="text-left">
                      <p className="text-[9px] text-gray-400 font-bold mb-0.5">{item.transactionDate}</p>
                      <p className={`text-sm font-bold leading-tight ${isSentToOshi ? "text-pink-600" : "text-oshi-text"}`}>
                        {isSentToOshi 
                          ? `${absAmt.toLocaleString()}円を推しに届けた💕` 
                          : item.remarks || "推しへの想い"}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className={`text-base font-black ${isSentToOshi ? "text-pink-500" : "text-oshi-main"}`}>
                        {/* 届いた時（ピンク）は＋を表示しない、課金（水色）は＋を表示 */}
                        {isSentToOshi ? "" : "+"}{absAmt.toLocaleString()}円
                      </p>
                      {isSentToOshi && (
                        <div className="flex items-center justify-end gap-0.5 -mt-1">
                          <span className="text-[8px] text-pink-300 font-black uppercase tracking-tighter">
                            Love Delivered
                          </span>
                          <span className="text-[10px]">✨</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="h-12 flex items-center justify-center">
          <p className="text-[9px] text-oshi-main/30 font-bold tracking-widest uppercase text-center">
            Presented by OshiPay Finance
          </p>
        </div>
      </div>
    </CloudBackground>
  );
}