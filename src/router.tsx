import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@layouts/AppShell'
import { AuthLayout } from '@layouts/AuthLayout'
import { PrivateRoute } from '@components/PrivateRoute'
import { ErrorBoundary } from '@errors/ErrorBoundary'
import { lazy, Suspense } from 'react'

const LoginPage = lazy(() => import('@/pages/LoginPage'))
const LoginErrorPage = lazy(() => import('@/pages/LoginErrorPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const ReportsPage = lazy(() => import('@/pages/ReportsPage'))
const SecurityPage = lazy(() => import('@/pages/SecurityPage'))
const GetPersonsPage = lazy(() => import('@/pages/persons/GetPersonsPage'))
const AddPersonPage = lazy(() => import('@/pages/persons/AddPersonPage'))
const UpdatePersonPage = lazy(() => import('@/pages/persons/UpdatePersonPage'))
const DeletePersonPage = lazy(() => import('@/pages/persons/DeletePersonPage'))
const GetCompaniesPage = lazy(() => import('@/pages/companies/GetCompaniesPage'))
const AddCompanyPage = lazy(() => import('@/pages/companies/AddCompanyPage'))
const UpdateCompanyPage = lazy(() => import('@/pages/companies/UpdateCompanyPage'))
const DeleteCompanyPage = lazy(() => import('@/pages/companies/DeleteCompanyPage'))

const PageLoader = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
  </div>
)

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/login',
    element: <AuthLayout>{withSuspense(LoginPage)}</AuthLayout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/error/login',
    element: <AuthLayout>{withSuspense(LoginErrorPage)}</AuthLayout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <AppShell />
      </PrivateRoute>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: withSuspense(DashboardPage) },
      { path: 'person/get', element: withSuspense(GetPersonsPage) },
      { path: 'person/add', element: withSuspense(AddPersonPage) },
      { path: 'person/update', element: withSuspense(UpdatePersonPage) },
      { path: 'person/delete', element: withSuspense(DeletePersonPage) },
      { path: 'company/get', element: withSuspense(GetCompaniesPage) },
      { path: 'company/add', element: withSuspense(AddCompanyPage) },
      { path: 'company/update', element: withSuspense(UpdateCompanyPage) },
      { path: 'company/delete', element: withSuspense(DeleteCompanyPage) },
      { path: 'report', element: withSuspense(ReportsPage) },
      { path: 'security', element: withSuspense(SecurityPage) },
    ],
  },
  {
    path: '*',
    element: withSuspense(NotFoundPage),
  },
])
