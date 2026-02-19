import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
    en: {
        translation: {
            "welcome": "Welcome Back",
            "total_balance": "Total Balance",
            "analytics": "Analytics",
            "transactions": "Transactions",
            "view_all": "View All",
            "add_transaction": "Add Transaction",
            "home": "Home",
            "wallet": "Wallet",
            "profile": "Profile",
            "login": "Login",
            "signup": "Sign Up",
            "email": "Email",
            "password": "Password",
            "name": "Full Name",
            "submit": "Submit",
            "dont_have_account": "Don't have an account?",
            "have_account": "Already have an account?",
            "dashboard": "Dashboard",
            "my_expenses": "My Expenses",
            "expense": "Expense",
            "income": "Income",
            "calendar": "Calendar",
            "total_salary": "Total Salary",
            "total_expense": "Total Expense",
            "food_and_drinks": "Food And Drinks",
            "ethio_wealth": "EthioWealth"
        }
    },
    am: {
        translation: {
            "welcome": "እንኳን ደህና መጡ",
            "total_balance": "ጠቅላላ ቀሪ ሂሳብ",
            "analytics": "ትንታኔ",
            "transactions": "ግብይቶች",
            "view_all": "ሁሉንም ይመልከቱ",
            "add_transaction": "አዲስ ግብይት",
            "home": "ዋና ገጽ",
            "wallet": "ቦርሳ",
            "profile": "መገለጫ",
            "login": "ግባ",
            "signup": "ተመዝገብ",
            "email": "ኢሜይል",
            "password": "የይለፍ ቃል",
            "name": "ሙሉ ስም",
            "submit": "አስገባ",
            "dont_have_account": "መለያ የለዎትም?",
            "have_account": "መለያ አለዎት?",
            "dashboard": "ዳሽቦርድ",
            "my_expenses": "ወጪዎቼ",
            "expense": "ወጪ",
            "income": "ገቢ",
            "calendar": "ቀን መቁጠሪያ",
            "total_salary": "ጠቅላላ ደመወዝ",
            "total_expense": "ጠቅላላ ወጪ",
            "food_and_drinks": "ምግብ እና መጠጥ",
            "ethio_wealth": "ኢትዮ-ሀብት"
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        lng: "en", // default language
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
