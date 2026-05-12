import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RouteFallback } from "../components/RouteFallback";
import { MainLayout } from "../components/layout/MainLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";

const HomePage = lazy(() => import("../pages/HomePage").then((module) => ({ default: module.HomePage })));
const MarketplacePage = lazy(() => import("../pages/MarketplacePage").then((module) => ({ default: module.MarketplacePage })));
const ToolDetailPage = lazy(() => import("../pages/ToolDetailPage").then((module) => ({ default: module.ToolDetailPage })));
const AdminPage = lazy(() => import("../pages/AdminPage").then((module) => ({ default: module.AdminPage })));

function withSuspense(element) {
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: withSuspense(<HomePage />) },
      { path: "tools", element: withSuspense(<MarketplacePage />) },
      { path: "tools/:slug", element: withSuspense(<ToolDetailPage />) },
      {
        path: "admin",
        element: (
          <ProtectedRoute requireAdmin>
            {withSuspense(<AdminPage />)}
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
