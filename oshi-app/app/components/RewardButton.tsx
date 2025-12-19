// "use client";

// import { useState } from "react";

// type RewardButtonProps = {
//   label: string;
//   rewardKey: string; // API用のキー（例: "no_cheat", "read_comments"）
//   amount: number;
// };

// export default function RewardButton({
//   label,
//   rewardKey,
//   amount,
// }: RewardButtonProps) {
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<string | null>(null);

//   const handleClick = async () => {
//     setLoading(true);
//     setMessage(null);

//     try {
//       const res = await fetch("/api/reward", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ rewardKey }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setMessage(`+${amount}円 追加されました！`);
//       } else {
//         setMessage(`失敗：${data.error}`);
//       }
//     } catch (err) {
//       setMessage("エラーが発生しました");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="text-center">
//       <button
//         onClick={handleClick}
//         disabled={loading}
//         className="
//           px-6 py-3
//           bg-oshi-main text-white font-semibold
//           rounded-cloud shadow-soft
//           hover:bg-oshi-sub
//           disabled:bg-gray-300 disabled:cursor-not-allowed
//           transition
//         "
//       >
//         {loading ? "送信中..." : label}
//       </button>

//       {message && (
//         <p className="mt-2 text-sm text-gray-700">{message}</p>
//       )}
//     </div>
//   );
// }

"use client";

import { useState } from "react";

export type RewardKey = "call" | "think" | "talk";

type Props = {
  label: string;
  rewardKey: RewardKey;
  amount: number;
};

export default function RewardButton({ label, rewardKey, amount }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClick = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rewardKey,
          amount,
        }),
      });

      if (!res.ok) throw new Error();

      // 🔄 残高を即更新
      window.location.reload();
    } catch {
      setError("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="rounded-xl bg-oshi-main text-white p-4 text-sm"
    >
      {loading ? "処理中..." : label}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </button>
  );
}
