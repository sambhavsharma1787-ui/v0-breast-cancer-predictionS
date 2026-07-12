import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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
            <div className="space-y-4">
              {riskTrendData.map((item) => (
                <div key={item.month} className="flex items-center gap-4">
                  <span className="w-12 font-medium text-sm text-slate-600">{item.month}</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full"
                      style={{ width: `${item.risk}%` }}
                    />
                  </div>
                  <span className="w-12 text-right font-semibold text-slate-900">{item.risk}%</span>
                </div>
              ))}
            </div>
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
              <div className="space-y-3">
                {featureImpactData.map((item) => (
                  <div key={item.feature} className="flex items-center gap-3">
                    <span className="w-24 text-sm font-medium text-slate-600">{item.feature}</span>
                    <div className="flex-1 bg-slate-200 rounded h-6 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded"
                        style={{ width: `${item.impact * 3}%` }}
                      />
                    </div>
                    <span className="w-12 text-right font-semibold text-slate-900">{item.impact}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Risk Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Distribution</CardTitle>
              <CardDescription>Breakdown of your predictions by risk category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium text-slate-600">{item.name}</span>
                    <div className="flex-1 bg-slate-200 rounded h-2 overflow-hidden">
                      <div
                        className="h-full rounded"
                        style={{
                          width: `${item.value}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                    <span className="w-12 text-right font-semibold text-slate-900">{item.value}%</span>
                  </div>
                ))}
              </div>
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
