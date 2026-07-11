import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Share2, Trash2, Eye } from 'lucide-react'

export default function ReportsPage() {
  const reports = [
    {
      id: 1,
      name: 'Q4 2024 Health Assessment',
      date: 'Dec 15, 2024',
      type: 'PDF',
      size: '2.4 MB',
      predictions: 3,
    },
    {
      id: 2,
      name: 'Annual Review Report',
      date: 'Dec 1, 2024',
      type: 'PDF',
      size: '3.1 MB',
      predictions: 12,
    },
    {
      id: 3,
      name: 'Risk Trend Analysis',
      date: 'Nov 20, 2024',
      type: 'CSV',
      size: '524 KB',
      predictions: 24,
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Reports</h2>
          <p className="text-slate-600 mt-1">Generate and manage your health reports</p>
        </div>

        {/* Generate New Report */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle>Generate New Report</CardTitle>
            <CardDescription>Create a comprehensive PDF or CSV report of your predictions</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button>Generate PDF Report</Button>
            <Button variant="outline">Export as CSV</Button>
            <Button variant="outline">Schedule Report</Button>
          </CardContent>
        </Card>

        {/* Report List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Reports</CardTitle>
            <CardDescription>{reports.length} reports available</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-semibold text-slate-600">{report.type}</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{report.name}</p>
                        <p className="text-sm text-slate-600">{report.date} • {report.size} • {report.predictions} predictions</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" title="View">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="Download">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="Share">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="Delete">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Report Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Report Templates</CardTitle>
            <CardDescription>Choose a template for custom reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {[
                { name: 'Executive Summary', desc: 'Key metrics and insights' },
                { name: 'Full Assessment', desc: 'Complete detailed analysis' },
                { name: 'Trend Report', desc: 'Historical trends and patterns' },
              ].map((template, i) => (
                <div key={i} className="p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors">
                  <p className="font-medium">{template.name}</p>
                  <p className="text-sm text-slate-600 mt-1">{template.desc}</p>
                  <Button size="sm" variant="outline" className="w-full mt-4">
                    Use Template
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
