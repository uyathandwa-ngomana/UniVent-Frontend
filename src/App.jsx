import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";


import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";


import StudentEventFeed from "./pages/student/StudentEventFeed";
import EventDetail from "./pages/student/EventDetail";
import MyBookings from "./pages/student/MyBookings";
import TicketView from "./pages/student/TicketView";
import StudentProfile from "./pages/student/StudentProfile";


import OrganizerEvents from "./pages/organizer/OrganizerEvents";
import CreateEvent from "./pages/organizer/CreateEvent";
import EditEvent from "./pages/organizer/EditEvent";
import EventRegistrations from "./pages/organizer/EventRegistrations";


import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminUsers from "./pages/admin/AdminUsers";


import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";


/*
 * Gate for authentication. Unauthenticated users are sent to /login.
 *
 * Works both as a wrapper around a single element (children) and as a
 * layout route for a group of nested routes (renders <Outlet /> when no
 * children are provided).
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children ?? <Outlet />;
}


/*
 * Gate for role-based access. Authenticated users whose role is not in
 * allowedRoles are sent to /unauthorized.
 *
 * Like ProtectedRoute, it supports both a single wrapped element and a
 * nested route group via <Outlet />.
 */
function RoleRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ?? <Outlet />;
}

/*
 *
 * The entire route map.

 *
 * Route structure:
 * /                        → redirect based on role
 * /login                   → Login page (public)
 * /register                → Register page (public)
 * /unauthorized            → 403 page (public)
 * /student/*               → Student route group (protected, STUDENT)
 * /organizer/*             → Organizer route group (protected, ORGANIZER)
 * /admin/*                 → Admin route group (protected, ADMIN)
 * *                        → 404 catch-all
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        
        <Route path="/" element={<RootRedirect />} />

        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        
        <Route
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["STUDENT"]} />
            </ProtectedRoute>
          }
        >
          <Route path="/student" element={<StudentEventFeed />} />
          <Route path="/student/events/:id" element={<EventDetail />} />
          <Route path="/student/bookings" element={<MyBookings />} />
          <Route path="/student/tickets/:bookingId" element={<TicketView />} />
          <Route path="/student/profile" element={<StudentProfile />} />
        </Route>

        
        <Route
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["ORGANIZER"]} />
            </ProtectedRoute>
          }
        >
          <Route path="/organizer" element={<OrganizerEvents />} />
          <Route path="/organizer/events/create" element={<CreateEvent />} />
          <Route path="/organizer/events/:id/edit" element={<EditEvent />} />
          <Route
            path="/organizer/events/:id/registrations"
            element={<EventRegistrations />}
          />
        </Route>

        
        <Route
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["ADMIN"]} />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>

        
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}


function RootRedirect() {
  const { isAuthenticated, getHomePath } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getHomePath()} replace />;
}
