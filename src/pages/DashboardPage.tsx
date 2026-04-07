import { Link } from 'react-router-dom'
import { PageLayout } from '@layouts/PageLayout'
import { useUser } from '@session/sessionStore'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card'
import { ArrowRight, Building2, FileText, Users } from 'lucide-react'

export default function DashboardPage() {
  const user = useUser()

  return (
    <PageLayout
      title="Dashboard"
      breadcrumbs={<span className="text-sm text-muted-foreground">Home</span>}
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Card className="md:col-span-2 xl:col-span-3">
          <CardHeader>
            <CardTitle>Welcome back, {user?.name || 'User'}!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Version 1 focuses on protected navigation, dual login methods, and the first
              working person list page.
            </p>
          </CardContent>
        </Card>

        <Link to="/dashboard/person/get" className="block">
          <Card className="h-full transition-colors hover:border-brand/40 hover:bg-brand/5">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-brand" />
                  Get Person
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View paginated person records with company references.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/dashboard/company/get" className="block">
          <Card className="h-full transition-colors hover:border-brand/40 hover:bg-brand/5">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-brand" />
                  Get Company
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Review the company area scaffold and future list entry point.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/dashboard/report" className="block">
          <Card className="h-full transition-colors hover:border-brand/40 hover:bg-brand/5">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-brand" />
                  Report
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Placeholder report workspace for later business reporting flows.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </PageLayout>
  )
}
