// lib/sunabar.ts

const BASE_URL =
  process.env.SUNABAR_BASE_URL ??
  "https://api.sunabar.gmo-aozora.com/personal/v1";

const ACCESS_TOKEN = process.env.SUNABAR_ACCESS_TOKEN as string;

if (!ACCESS_TOKEN) {
  throw new Error("SUNABAR_ACCESS_TOKEN が設定されていません");
}

/**
 * 共通 fetch ラッパー（Sunabar API専用）
 */
export async function sunabarFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    cache: "no-store", // ✅ 銀行APIなのでキャッシュ無効
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": ACCESS_TOKEN,
      ...(options.headers ?? {}),
    } as Record<string, string>,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sunabar API error: ${res.status} ${text}`);
  }

  return res.json();
}

/**
 * 残高照会（使いわけ口座）
 */
export async function getSpAccountBalance() {
  const data = await sunabarFetch<{
    balance: {
      amount: number;
    };
    spAccountBalances: {
      spAccountId: string;
      balance: number;
    }[];
  }>("/accounts/balances");

  return data.spAccountBalances;
}

/**
 * つかいわけ口座間振替（ご褒美付与）
 */
export async function transferSpAccount(params: {
  depositSpAccountId: string;
  debitSpAccountId: string;
  amount: number;
}) {
  return sunabarFetch("/transfer/spaccounts-transfer", {
    method: "POST",
    body: JSON.stringify({
      depositSpAccountId: params.depositSpAccountId,
      debitSpAccountId: params.debitSpAccountId,
      currencyCode: "JPY",
      paymentAmount: params.amount,
    }),
  });
}

/**
 * 入出金明細の型定義
 */
export interface Transaction {
  transactionDate: string; // 処理日 (YYYY-MM-DD)
  valueDate: string;       // 起算日
  remarks: string;         // 摘要
  amount: number;          // 取引金額
  balance: number;         // 取引後残高
}

/**
 * 親口座の入出金明細照会 (GET)
 * SUNABAR_PARENT_ACCOUNT_ID を使用して明細を取得します
 */
export async function getParentTransactions() {
  const accountId = process.env.SUNABAR_PARENT_ACCOUNT_ID;
  
  if (!accountId) {
    throw new Error("SUNABAR_PARENT_ACCOUNT_ID が設定されていません");
  }

  // IDから数字以外（SPなど）を除去してリクエストに使用
//   const cleanId = accountId.replace(/[^\d]/g, "");
  
  // クエリパラメータとして accountId を付与
  const path = `/accounts/transactions?accountId=${accountId}`;

  const data = await sunabarFetch<{
    transactions: Transaction[];
  }>(path);

  // 明細の配列を返す
  return data.transactions || [];
}