import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";


import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";


import StudentEventFeed from "./pages/student/StudentEventFeed";
import EventDetail from "./pages/student/EventDetail";
import MyBookings from "./pages/student/MyBookings";
import TicketView from "./pages/student/TicketView";
import StudentProfile from "./pages/student/StudentProfile";
import StudentNotifications from "./pages/student/StudentNotifications";


import OrganizerEvents from "./pages/organizer/OrganizerEvents";
import CreateEvent from "./pages/organizer/CreateEvent";
import EditEvent from "./pages/organizer/EditEvent";
import EventRegistrations from "./pages/organizer/EventRegistrations";


import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminUsers from "./pages/admin/AdminUsers";


import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";


function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


function RoleRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

/*
 *
 * The entire route map.

 *
 * Route structure:
 * /                        → redirect based on role
 * /login                   → Login page (public)
 * /register                → Register page (public)
 * /student                 → Student event feed
 * /student/events/:id      → Event detail
 * /student/bookings        → My bookings
 * /student/tickets/:id     → Ticket view
 * /student/profile         → Student profile
 * /organizer               → Organizer my events
 * /organizer/events/create → Create event form
 * /organizer/events/:id/edit          → Edit event form
 * /organizer/events/:id/registrations → Event registrations
 * /admin                   → Admin overview dashboard
 * /admin/events            → All events
 * /admin/users             → All users
 * /unauthorized            → 403 page
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
          path="/student"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["STUDENT"]}>
                <StudentEventFeed />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/events"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["STUDENT"]}>
                <StudentEventFeed />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/events/:id"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["STUDENT"]}>
                <EventDetail />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/my-events"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["STUDENT"]}>
                <MyBookings />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/bookings"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["STUDENT"]}>
                <MyBookings />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/tickets/:bookingId"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["STUDENT"]}>
                <TicketView />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/notifications"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["STUDENT"]}>
                <StudentNotifications />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["STUDENT"]}>
                <StudentProfile />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        
        <Route
          path="/organizer"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["ORGANIZER"]}>
                <OrganizerEvents />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/events/create"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["ORGANIZER"]}>
                <CreateEvent />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/events/:id/edit"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["ORGANIZER"]}>
                <EditEvent />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/events/:id/registrations"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["ORGANIZER"]}>
                <EventRegistrations />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

       
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["ADMIN"]}>
                <AdminEvents />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["ADMIN"]}>
                <AdminUsers />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        
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
