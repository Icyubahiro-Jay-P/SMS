# Stock Management System - Frontend

## Features

- User Registration & Login with JWT Authentication
- Product Management (CRUD operations)
- Warehouse Management
- Stock Transaction Recording
- Comprehensive Reports (Daily, Weekly, Monthly, Stock Reports)
- Responsive UI with Tailwind CSS
- Protected Routes with Authentication

## Setup Instructions

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Build for production:

   ```bash
   npm run build
   ```

4. Preview production build:
   ```bash
   npm run preview
   ```

## Project Structure

```
src/
├── api/              # Axios API calls
├── components/       # Reusable components
├── context/          # React Context (Auth)
├── pages/            # Page components
├── App.jsx           # Main app component
└── main.jsx          # Entry point
```

## Pages

1. **Login** - User authentication
2. **Register** - Create new account
3. **Dashboard** - Overview and navigation
4. **Products** - Manage products (Create, View)
5. **Warehouses** - Manage warehouses (Create, View)
6. **Transactions** - Record stock movements
7. **Reports** - Generate various reports

## Configuration

- Backend URL: `http://localhost:5000`
- Frontend Port: `5173`
- Proxy API calls through Vite dev server

## Technologies

- React 18
- Vite
- Tailwind CSS
- Axios
- React Router v6
- JWT for authentication
