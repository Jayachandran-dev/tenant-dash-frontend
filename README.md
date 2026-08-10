
---

## Frontend — `tenant-dash-frontend/README.md`

```md
# Tenant Dash – Frontend

Multi-tenant business dashboard built with **React, Vite, Material UI, and Socket.io**.

Live app: [https://tenant-dash-frontend.vercel.app](https://tenant-dash-frontend.vercel.app)  
Backend: `https://tenant-dash-api.onrender.com`

---

## Features

- OTP login / signup (mobile + country code)
- Multi-tenant switcher (bottom sheet)
- Role-based UI & route guards (owner / employee)
- **Business Profile** – logo, visiting card, theme color & mode
- **Users** – add members by mobile
- **Items** – full CRUD (responsive table/cards)
- Real-time business updates (Socket.io)
- PWA (installable)
- Light / dark theme per business
- Toast notifications
- Mobile bottom navigation

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + Vite |
| UI | Material UI (MUI) |
| Routing | React Router |
| HTTP | Axios |
| Real-time | Socket.io-client |
| Images | Cloudinary |
| PWA | vite-plugin-pwa |
| Hosting | Vercel |

---

## Screens

- Login / Signup (OTP)
- Tenant selector (if multiple businesses)
- Dashboard
- Items (list + add/edit/delete)
- Users (owner only)
- Business Profile (tabs: details, appearance, images)

---

## Setup (Local)

### 1. Clone & install

```bash
git clone https://github.com/Jayachandran-dev/tenant-dash-frontend.git
cd tenant-dash-frontend
npm install

src/
  api/axios.js
  components/
    Layout.jsx
    PageHeader.jsx
    CommonList.jsx
    BusinessSwitcher.jsx
    UserForm.jsx
    ItemForm.jsx
    ...
  context/
    AuthContext.jsx
    ToastContext.jsx
  hooks/usePermission.js
  pages/
    Login.jsx
    Signup.jsx
    Dashboard.jsx
    Items.jsx
    Users.jsx
    BusinessProfile.jsx
  theme/
  socket.js
  utils/uploadImage.js