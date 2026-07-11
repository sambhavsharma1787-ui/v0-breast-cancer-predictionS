import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const riskTrendData = [
  { month: 'Jan', risk: 32 },
  { month: 'Feb', risk: 38 },
  { month: 'Mar', risk: 35 },
  { month: 'Apr', risk: 42 },
  { month: 'May', risk: 38 },
  { month: 'Jun', risk: 35 },
]

const featureImpactData = [
  { feature: 'Concavity', impact: 28 },
  { feature: 'Compactness', impact: 22 },
  { feature: 'Radius', impact: 18 },
  { feature: 'Area', impact: 15 },
  { feature: 'Smoothness', impact: 12 },
  { feature: 'Others', impact: 5 },
]

const riskDistribution = [
  { name: 'Low', value: 45, color: '#10b981' },
  { name: 'Moderate', value: 35, color: '#f59e0b' },
  { name: 'High', value: 20, color: '#ef4444' },
]

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Analytics</h2>
          <p className="text-slate-600 mt-1">Advanced analysis of your predictions and health data</p>
        </div>

        {/* Risk Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Score Trend</CardTitle>
            <CardDescription>Your average risk score over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={riskTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="risk" stroke="#0ea5e9" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-6">
          {/* Feature Impact */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Impact Analysis</CardTitle>
              <CardDescription>Most influential features for your risk</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={featureImpactData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="feature" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="impact" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Risk Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Distribution</CardTitle>
              <CardDescription>Breakdown of your predictions by risk category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} (${value}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Statistical Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600 font-medium">Average Risk</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">35%</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600 font-medium">Highest Risk</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">72%</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600 font-medium">Standard Deviation</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">14%</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600 font-medium">Total Assessments</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
