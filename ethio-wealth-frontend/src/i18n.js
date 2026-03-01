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
            "ethio_wealth": "EthioWealth",
            "detailed_analytics": "Detailed Analytics",
            "income_vs_expense": "Income vs Expense",
            "expense_breakdown": "Expense Breakdown",
            "top_spending_categories": "Top Spending Categories",
            "developer_pro": "Developer Pro",
            "automate_your_finances": "Automate your finances",
            "connect_bank": "Connect your bank accounts directly. Save 14 hours every month.",
            "upgrade_now": "Upgrade Now",
            "overview": "Overview",
            "my_wallet": "My Wallet",
            "profile_settings": "Profile Settings"
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
            "ethio_wealth": "ኢትዮ-ሀብት",
            "detailed_analytics": "ዝርዝር ትንታኔ",
            "income_vs_expense": "ገቢ እና ወጪ",
            "expense_breakdown": "የወጪ ዝርዝር",
            "top_spending_categories": "ከፍተኛ የወጪ ምድቦች",
            "developer_pro": "የገንቢ ፕሮ",
            "automate_your_finances": "ፋይናንስዎን ያዘምኑ",
            "connect_bank": "የባንክ መለያዎችዎን በቀጥታ ያገናኙ። በየወሩ 14 ሰዓታት ይቆጥቡ።",
            "upgrade_now": "አሁን ያሳድጉ",
            "overview": "አጠቃላይ እይታ",
            "my_wallet": "የእኔ ቦርሳ",
            "profile_settings": "የመገለጫ ቅንብሮች"
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
