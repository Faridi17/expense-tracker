import { CategoryType, ExpenseCategoriesType } from "@/types";

import * as Icons from "phosphor-react-native"; // Import all icons dynamically

export const expenseCategories: ExpenseCategoriesType = {
  groceries: {
    label: "Belanja",
    value: "groceries",
    icon: Icons.ShoppingCart,
    bgColor: "#4B5563", // Deep Teal Green
  },
  rent: {
    label: "Sewa",
    value: "rent",
    icon: Icons.House,
    bgColor: "#075985", // Dark Blue
  },
  utilities: {
    label: "Kebutuhan",
    value: "utilities",
    icon: Icons.Lightbulb,
    bgColor: "#ca8a04", // Dark Golden Brown
  },
  transportation: {
    label: "Transportasi",
    value: "transportation",
    icon: Icons.Car,
    bgColor: "#b45309", // Dark Orange-Red
  },
  entertainment: {
    label: "Hiburan",
    value: "entertainment",
    icon: Icons.FilmStrip,
    bgColor: "#0f766e", // Darker Red-Brown
  },
  dining: {
    label: "Makanan",
    value: "dining",
    icon: Icons.ForkKnife,
    bgColor: "#be185d", // Dark Red
  },
  health: {
    label: "Kesehatan",
    value: "health",
    icon: Icons.Heart,
    bgColor: "#e11d48", // Dark Purple
  },
  insurance: {
    label: "Asuransi",
    value: "insurance",
    icon: Icons.ShieldCheck,
    bgColor: "#404040", // Dark Gray
  },
  savings: {
    label: "Tabungan",
    value: "savings",
    icon: Icons.PiggyBank,
    bgColor: "#065F46", // Deep Teal Green
  },
  clothing: {
    label: "Pakaian",
    value: "clothing",
    icon: Icons.TShirt,
    bgColor: "#7c3aed", // Dark Indigo
  },
  personal: {
    label: "Pribadi",
    value: "personal",
    icon: Icons.User,
    bgColor: "#a21caf", // Deep Pink
  },
  others: {
    label: "Lainnya",
    value: "others",
    icon: Icons.DotsThreeOutline,
    bgColor: "#525252", // Neutral Dark Gray
  },
};

export const incomeCategory: CategoryType = {
  label: "Pemasukan",
  value: "income",
  icon: Icons.CurrencyDollarSimple,
  bgColor: "#16a34a", // Dark
};

export const transactionTypes = [
  { label: "Pengeluaran", value: "expense" },
  { label: "Pemasukan", value: "income" },
];
export const genderTypes = [
  { label: "Laki-laki", value: "man" },
  { label: "Perempuan", value: "woman" },
];
