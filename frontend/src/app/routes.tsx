import { createBrowserRouter } from "react-router";
import AppLayout from "./components/AppLayout";
import PublicLayout from "./components/PublicLayout";
import AuthLayout from "./components/AuthLayout";

import LandingPage from "./pages/public/LandingPage";
import DocsPage from "./pages/public/DocsPage";
import PrivacyPage from "./pages/public/PrivacyPage";
import TermsPage from "./pages/public/TermsPage";
import NotFoundPage from "./pages/public/NotFoundPage";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";

import DashboardPage from "./pages/app/DashboardPage";
import AllProjectsPage from "./pages/app/projects/AllProjectsPage";
import CreateProjectPage from "./pages/app/projects/CreateProjectPage";
import ProjectDetailsPage from "./pages/app/projects/ProjectDetailsPage";
import EditProjectPage from "./pages/app/projects/EditProjectPage";
import AllTasksPage from "./pages/app/tasks/AllTasksPage";
import CreateTaskPage from "./pages/app/tasks/CreateTaskPage";
import TaskDetailsPage from "./pages/app/tasks/TaskDetailsPage";
import EditTaskPage from "./pages/app/tasks/EditTaskPage";
import KanbanPage from "./pages/app/kanban/KanbanPage";
import CalendarPage from "./pages/app/calendar/CalendarPage";
import AnalyticsPage from "./pages/app/analytics/AnalyticsPage";
import TeamMembersPage from "./pages/app/team/TeamMembersPage";
import MemberProfilePage from "./pages/app/team/MemberProfilePage";
import NotificationsPage from "./pages/app/notifications/NotificationsPage";
import SearchResultsPage from "./pages/app/search/SearchResultsPage";
import FilesPage from "./pages/app/files/FilesPage";
import ProfilePage from "./pages/app/profile/ProfilePage";
import EditProfilePage from "./pages/app/profile/EditProfilePage";
import SecurityPage from "./pages/app/profile/SecurityPage";
import GeneralSettingsPage from "./pages/app/settings/GeneralSettingsPage";
import AppearancePage from "./pages/app/settings/AppearancePage";
import NotificationsSettingsPage from "./pages/app/settings/NotificationsSettingsPage";
import BillingPage from "./pages/app/settings/BillingPage";
import IntegrationsPage from "./pages/app/settings/IntegrationsPage";
import ApiKeysPage from "./pages/app/settings/ApiKeysPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboardPage from "./pages/app/admin/AdminDashboardPage";
import UsersManagementPage from "./pages/app/admin/UsersManagementPage";
import AdminProjectsPage from "./pages/app/admin/AdminProjectsPage";
import ActivityPage from "./pages/app/activity/ActivityPage";
import SystemLogsPage from "./pages/app/admin/SystemLogsPage";
import AdminTeamsPage from "./pages/app/admin/AdminTeamsPage";
import PlatformSettingsPage from "./pages/app/admin/PlatformSettingsPage";
export const router = createBrowserRouter([
  { path: "/", Component: LandingPage },
  {
    Component: PublicLayout,
    children: [
      { path: "/docs", Component: DocsPage },
      { path: "/privacy", Component: PrivacyPage },
      { path: "/terms", Component: TermsPage },
    ],
  },
  {
    Component: AuthLayout,
    children: [
      { path: "/login", Component: LoginPage },
      { path: "/register", Component: RegisterPage },
      { path: "/forgot-password", Component: ForgotPasswordPage },
      { path: "/reset-password", Component: ResetPasswordPage },
      { path: "/verify-email", Component: VerifyEmailPage },
    ],
  },
  {
    path: "/app",
    Component: ProtectedRoute,
    children: [
      {
        Component: AppLayout,
        children: [
      { index: true, Component: DashboardPage },
      { path: "dashboard", Component: DashboardPage },
      { path: "projects", Component: AllProjectsPage },
      { path: "projects/create", Component: CreateProjectPage },
      { path: "projects/:id", Component: ProjectDetailsPage },
      { path: "projects/:id/edit", Component: EditProjectPage },
      { path: "tasks", Component: AllTasksPage },
      { path: "tasks/create", Component: CreateTaskPage },
      { path: "tasks/:id", Component: TaskDetailsPage },
      { path: "tasks/:id/edit", Component: EditTaskPage },
      { path: "kanban", Component: KanbanPage },
      { path: "calendar", Component: CalendarPage },
      { path: "analytics", Component: AnalyticsPage },
      { path: "team", Component: TeamMembersPage },
      { path: "team/:id", Component: MemberProfilePage },
      { path: "notifications", Component: NotificationsPage },
      { path: "search", Component: SearchResultsPage },
      { path: "files", Component: FilesPage },
      { path: "profile", Component: ProfilePage },
      { path: "profile/edit", Component: EditProfilePage },
      { path: "profile/security", Component: SecurityPage },
      { path: "settings", Component: GeneralSettingsPage },
      { path: "settings/general", Component: GeneralSettingsPage },
      { path: "settings/appearance", Component: AppearancePage },
      { path: "settings/notifications", Component: NotificationsSettingsPage },
      { path: "settings/billing", Component: BillingPage },
      { path: "settings/integrations", Component: IntegrationsPage },
      { path: "settings/api-keys", Component: ApiKeysPage },
      { path: "activity", Component: ActivityPage },
      {
        path: "admin",
        element: <ProtectedRoute allowedRoles={["Admin"]} />,
        children: [
          { index: true, Component: AdminDashboardPage },
          { path: "users", Component: UsersManagementPage },
          { path: "projects", Component: AdminProjectsPage },
          { path: "teams", Component: AdminTeamsPage },
          { path: "settings", Component: PlatformSettingsPage },
          { path: "logs", Component: SystemLogsPage },
        ],
      },
    ],
  },
],
},
  { path: "*", Component: NotFoundPage },
]);
