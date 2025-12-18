import { sunabarFetch, getSpAccountBalance } from "./sunabar";

interface SpAccount {
  accountId: string;
  spAccountName: string;
  odBalance: string; 
}

export async function executeDevilTransfer(params: {
  oshiAccountId: string;   
  parentAccountId: string; 
}) {
  const now = new Date();
  const TODAY = now.toLocaleDateString('sv-SE'); // "YYYY-MM-DD" 形式で取得

  // 最新の残高を取得
  const balances = (await getSpAccountBalance() as unknown) as SpAccount[];
  const oshiAccount = balances.find((acc) => acc.accountId === params.oshiAccountId);
  const amount = oshiAccount ? parseInt(oshiAccount.odBalance, 10) : 0;

  if (amount <= 0) throw new Error("捧げる想い（残高）がありません。");

  // --- IDの徹底修正 ---
  // A. 親口座IDから「0」を抜いて、振替用の本来のIDに戻す
  // 302010011594 -> 30210011594
  const originalParentId = params.parentAccountId.replace("SP", "");
  const restoredParentId = originalParentId.slice(0, 3) + originalParentId.slice(4); 
  const parentSpId = `SP${restoredParentId}`; // SP30210011594

  // B. 振込用の「0入り12桁」を作成
  const formattedParentIdForRequest = restoredParentId.slice(0, 3) + "0" + restoredParentId.slice(3);

  console.log("--- 悪魔の献上シークエンス開始 ---");
  console.log("Step 1 (振替) 入金先:", parentSpId); // SP30210011594 になるはず

  // --- 振替 (子 -> 親) ---
  await sunabarFetch("/transfer/spaccounts-transfer", {
    method: "POST",
    body: JSON.stringify({
      depositSpAccountId: parentSpId, // 本来のSP付きID
      debitSpAccountId: params.oshiAccountId,
      currencyCode: "JPY",
      paymentAmount: amount,
    }),
  });

  console.log("子 -> 親 成功！ (振込) 使用ID:", formattedParentIdForRequest);

  // --- 振込 (親 -> 事務所) ---
  return sunabarFetch("/transfer/request", {
    method: "POST",
    body: JSON.stringify({
      accountId: formattedParentIdForRequest, // 0入りの12桁
      transferDesignatedDate: TODAY,
      transferDateHolidayCode: "1",
      totalCount: "1",
      totalAmount: String(amount),
      transfers: [
        {
          itemId: "1",
          transferAmount: String(amount),
          beneficiaryBankCode: "0310",
          beneficiaryBranchCode: "301", 
          accountTypeCode: "1",
          accountNumber: "0000277",
          beneficiaryName: "ｽﾅﾊﾞ ﾂｷﾞｵ",
        },
      ],
    }),
  });
}

