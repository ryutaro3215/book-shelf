//Algorithm of check ISBN URL: http://datablog.trc.co.jp/2007/01/30133853.html

import { z } from "zod";

export const ISBNIdentifierSchema = z.object({
  type: z.enum(["ISBN_10", "ISBN_13"]),
  identifier: z
    .string()
    .regex(/^\d{10,13}$/, "ISBNは10〜13桁の数字である必要があります"),
});

// isbnフィールドのスキーマ（配列として直接扱う）
export const ISBNArraySchema = z
  .array(ISBNIdentifierSchema)
  .min(1, "少なくとも1つ以上のISBN識別子が必要です");

// ISBN-10 バリデーション関数
// const isValidISBN10 = (isbn: string): boolean => {
//   if (!/^\d{9}[\dX]$/.test(isbn)) return false;
//
//   const digits = isbn
//     .split("")
//     .map((char, idx) => (char === "X" && idx === 9 ? 10 : Number(char)));
//
//   const sum = digits.reduce((acc, digit, idx) => acc + digit * (10 - idx), 0);
//   return sum % 11 === 0;
// };
//
// // ISBN-13 バリデーション関数
// const isValidISBN13 = (isbn: string): boolean => {
//   if (!/^\d{13}$/.test(isbn)) return false;
//
//   const digits = isbn.split("").map(Number);
//   const sum = digits
//     .slice(0, 12)
//     .reduce((acc, digit, idx) => acc + digit * (idx % 2 === 0 ? 1 : 3), 0);
//   const checkDigit = (10 - (sum % 10)) % 10;
//
//   return digits[12] === checkDigit;
// };

// 共通 ISBN スキーマ
// export const isbnSchema = z
//   .string()
//   .transform((val) => val.replace(/[-\s]/g, "")) // ハイフン・空白除去
//   .refine(
//     (val) => isValidISBN10(val) || isValidISBN13(val),
//     "有効なISBN-10またはISBN-13形式である必要があります",
//   );
