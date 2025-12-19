"use client";

import { useState } from "react";

export default function SacrificeButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false); // 完了状態を追加

  const handleSacrifice = async () => {
    if (!confirm("あなたの全ての想い（全額）を推しに届けます。よろしいですか？💕")) return;

    setIsLoading(true);

    try {
      const res = await fetch("/api/transfer-all", { method: "POST" });
      const data = await res.json();

      if (data.success) {
        // --- ここがポイント：遷移を止める ---
        // router.push("/history"); // これを削除
        setIsCompleted(true);       // 代わりに完了フラグを立てる
        setIsLoading(false);
      } else {
        alert("想いが強すぎてエラーが発生しました…: " + data.error);
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-12 px-2 pb-10">
      <button
        onClick={handleSacrifice}
        disabled={isLoading || isCompleted} // 完了後も無効化
        className={`
          w-full py-8 px-4 relative overflow-hidden
          transition-all duration-300 active:scale-95
          rounded-2xl border-4
          ${isLoading || isCompleted
            ? "bg-gray-100 border-gray-300 text-gray-400" 
            : "bg-gradient-to-r from-pink-500 via-red-500 to-pink-500 text-white border-white shadow-[0_0_20px_rgba(244,114,182,0.6)] animate-gradient-x"
          }
        `}
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-xl font-black tracking-tighter italic">
            {isLoading ? "愛 を 届 け 中 . . . 💕" : isCompleted ? "想 い は 届 き ま し た 🕊️" : "無理、好き過ぎる……！"}
          </span>
          {!isLoading && !isCompleted && (
            <>
              <span className="text-[10px] font-bold opacity-90 leading-tight">
                溢れ出すこの想いを、すべて推しに捧げる
              </span>
              <div className="flex gap-1 mt-1">
                <span className="animate-ping">✨</span>
                <span className="text-[9px] uppercase tracking-widest font-light">
                  Send all my love to OSHI
                </span>
                <span className="animate-ping">✨</span>
              </div>
            </>
          )}
        </div>
      </button>

      {/* 完了時にトップページ上でメッセージを出す */}
      {isCompleted && (
        <p className="text-center text-pink-500 font-bold mt-4 animate-bounce">
          献上完了！推しの幸せがあなたの幸せです。
        </p>
      )}

      <p className="text-[10px] text-center text-gray-400 mt-3 italic">
        ※ボタンを押すと、口座の全額が即座に事務所へ送金（献上）されます。
      </p>
    </div>
  );
}