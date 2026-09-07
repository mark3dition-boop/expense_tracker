# Extrax

**Extrax** is a personal finance tracking mobile application designed to help users monitor their expenses, manage monthly budgets, and understand their financial habits.

Built with **React Native + Expo** and powered by **Supabase**, Extrax provides a simple and minimal interface for managing personal finances.

## ✨ Features

* 📊 **Monthly Financial Overview**

  * View your financial activity for the current month.
  * See total expenses and transaction statistics.

* 💰 **Budget Management**

  * Set a monthly spending limit.
  * Monitor your spending progress.
  * Visual indicators show your budget status:

    * 🔵 Safe spending
    * 🟡 Approaching the limit
    * 🔴 Nearing or exceeding the limit

* ➕ **Add Expenses**

  * Quickly record new expenses.
  * Store transaction details for future reference.

* 📋 **Transaction Tracking**

  * Keep track of your financial transactions.
  * Organize transactions by date and other relevant information.

* 🔐 **Authentication**

  * User authentication and account management powered by Supabase.

* ☁️ **Cloud Database**

  * Financial data is securely stored using Supabase.

## 🛠️ Tech Stack

| Technology   | Purpose                             |
| ------------ | ----------------------------------- |
| React Native | Mobile application framework        |
| Expo         | Development and application tooling |
| TypeScript   | Type-safe development               |
| Expo Router  | Application navigation              |
| Supabase     | Authentication & database           |
| PostgreSQL   | Data storage                        |
| AsyncStorage | Local session persistence           |

## 📱 Screens

> Screenshots will be added here.

<!--
Add screenshots of the application here.

Example:

![Home Screen](assets/screenshots/home.png)
![Budget Screen](assets/screenshots/budget.png)
![Transaction Screen](assets/screenshots/transaction.png)
-->

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* Expo CLI / EAS CLI
* Android Studio (for Android development)
* Xcode (for iOS development on macOS)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/extrax.git
cd extrax
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the values with your Supabase project credentials.

> **Important:** Do not commit your `.env` file to GitHub.

Make sure `.env` is included in `.gitignore`.

### 4. Start the development server

```bash
npx expo start
```

You can then run the application using:

```bash
npx expo start --android
```

or

```bash
npx expo start --ios
```

## 🗄️ Database

Extrax uses **Supabase PostgreSQL** as its backend database.

The database is responsible for storing information such as:

* User accounts
* Transactions
* Expenses
* Monthly budgets
* Transaction dates

The application communicates with Supabase through the Supabase JavaScript client.

## 📂 Project Structure

```text
Extrax/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx
│   │   └── ...
│   ├── ...
│   └── _layout.tsx
│
├── components/
│   ├── BudgetProgressCard.tsx
│   ├── ...
│
├── lib/
│   ├── supabase.ts
│   └── ...
│
├── assets/
│   ├── images/
│   └── ...
│
├── .env
├── app.json
├── package.json
├── tsconfig.json
└── README.md
```

## 🔒 Security

Extrax uses Supabase authentication and database security features to protect user data.

Environment variables containing Supabase credentials should never be committed to the repository.

For production deployments, appropriate **Row Level Security (RLS)** policies should be enabled in Supabase to ensure users can only access their own financial data.

## 🏗️ Build

To create a production build using EAS:

```bash
npx eas build
```

For an Android build:

```bash
npx eas build --platform android
```

For an iOS build:

```bash
npx eas build --platform ios
```

## 🧪 Development

Run the application in development mode:

```bash
npx expo start
```

For Android:

```bash
npx expo start --android
```

For development builds:

```bash
npx expo run:android
```

```bash
npx expo run:ios
```

## 🤝 Contributing

Contributions, issues, and suggestions are welcome.

If you would like to contribute:

1. Fork the repository.
2. Create a new branch.

```bash
git checkout -b feature/your-feature
```

3. Make your changes.
4. Commit your changes.

```bash
git commit -m "Add your feature"
```

5. Push the branch.

```bash
git push origin feature/your-feature
```

6. Open a Pull Request.

## 📄 License

This project is currently for educational and personal development purposes.

---

**Extrax** — *Track your money. Understand your spending.*
