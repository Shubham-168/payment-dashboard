# 💳 Payment Management Dashboard

A modern, responsive **Payment Management Dashboard** built with **React + Vite + Tailwind CSS + shadcn/ui + TanStack Table + React Query**.  
Designed with a **professional SaaS-grade UI**, smooth UX, and fully responsive layouts for **desktop and mobile devices**.

---

## 🚀 Features

### 📊 Dashboard Capabilities
- Customer payment listing with **pagination**
- **Search with debouncing**
- **Add / Edit / Delete customers**
- Confirmation dialogs using **SweetAlert2**
- Toast notifications using **React Toastify**
- **LocalStorage based persistence (Mock API)**
- **Fully responsive design**

---

### 🧭 Navigation & Layout
- **Desktop:** Hover-expandable collapsible sidebar
- **Mobile:** Hamburger-driven sidebar drawer
- Fixed **top navbar for mobile**
- Professional **layout hierarchy & spacing**

---

### 🖥 Desktop Table View
- Fixed **header + footer**
- Scrollable **table body**
- Search + toolbar inside table header
- Pagination footer
- Tooltip for truncated text
- Status badges
- Selection + bulk delete

---

### 📱 Mobile View (Card Layout)
- Card based UI instead of table
- Fixed toolbar (**Add + Search**)
- Only card list scrolls
- Touch friendly UX

---

## 🧠 Tech Stack

| Tech | Purpose |
|--------|----------|
| **React 18 + Vite** | Fast modern frontend |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | High quality UI components |
| **TanStack Table v8** | Advanced table features |
| **TanStack Query (React Query)** | API caching & state |
| **SweetAlert2** | Confirmation dialogs |
| **React Toastify** | Toast notifications |
| **Lucide Icons** | Modern icon system |

---

## 📁 Project Structure

src/
├─ components/
│ ├─ sidebar/
│ ├─ layout/
│ ├─ table/
│ ├─ modal/
│ ├─ cards/
│ └─ ui/ # shadcn/ui components
│
├─ hooks/
├─ services/
├─ pages/
├─ store/
├─ types/
└─ lib/


---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Shubham-168/payment-dashboard.git
cd payment-dashboard

2️⃣ Install Dependencies
npm install

3️⃣ Start Development Server
npm run dev


Open:
👉 http://localhost:5173

🔐 Environment Variables

Not required (localStorage-based mock backend is used).

🗃 LocalStorage API Design

This project uses LocalStorage as a mock backend.

Key used:

customers

Data Shape:
interface Customer {
  id: string;
  name: string;
  description: string;
  status: "Open" | "Paid" | "Due" | "Inactive";
  rate: number;
  balance: number;
  deposit: number;
}

🧩 Major Functional Modules
✔ Customer CRUD

Create customer (modal)

Update customer (modal)

Delete single / bulk customers

SweetAlert confirmation dialogs

✔ Search & Pagination

Debounced search input

Server-like pagination simulation

Page size selector

Dynamic page navigation

✔ Responsive UI

Desktop → Table Layout

Mobile → Card Layout

Mobile sidebar drawer navigation

Fixed top navbar

🎨 UI Design Goals

SaaS-grade dashboard UI

Pixel perfect spacing

Consistent typography

High contrast accessibility

Touch friendly mobile UX

🧪 Demo Data

Dummy customers are auto-generated for UI testing.

🛠 Recommended VS Code Extensions

Tailwind CSS IntelliSense

ESLint

Prettier

Error Lens

🔮 Future Enhancements

Real backend integration (Node / Supabase / Firebase)

Authentication system

Role-based access

Export reports (CSV / PDF)

Charts & analytics dashboard

👨‍💻 Author

Shubham Saini
Frontend Developer (React / Next.js / UI Engineering)

⭐ If you like this project

Please ⭐ star this repository and share feedback!

📝 License

MIT License — free for personal & commercial use.



