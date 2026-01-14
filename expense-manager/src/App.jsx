import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./layout/DashboardLayout";
import AuthLayout from "./layout/AuthLayout";

import Login from "./pages/Login";
import MyProfile from "./pages/MyProfile";
import MyExpense from "./pages/MyExpense";
import Groups from "./pages/Groups";
import GroupDetails from "./pages/GroupDetails";
import AddGroup from "./pages/add_group";
import Logout from "./pages/Logout";
import Invitations from "./pages/Invitations";


/* Simple auth guard */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH ROUTES (NO SIDEBAR) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* PROTECTED DASHBOARD ROUTES */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/groups" />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/expenses" element={<MyExpense />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/:groupId" element={<GroupDetails />} />
          <Route path="/add_group" element={<AddGroup />} />
          <Route path="/invites" element={<Invitations />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/new_page" element={<Logout />} />
          
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
