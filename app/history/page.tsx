import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronRight, Download, Trash2 } from 'lucide-react'

export default function HistoryPage() {
  const predictions = [
    {
      id: 1,
      date: 'Dec 15, 2024',
      score: 38,
      category: 'Moderate',
      features: 'Manual Entry',
    },
    {
      id: 2,
      date: 'Dec 10, 2024',
      score: 32,
      category: 'Low',
      features: 'Medical Image',
    },
    {
      id: 3,
      date: 'Dec 5, 2024',
      score: 65,
      category: 'High',
      features: 'Manual Entry',
    },
    {
      id: 4,
      date: 'Nov 28, 2024',
      score: 28,
      category: 'Low',
      features: 'Document Scan',
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Prediction History</h2>
          <p className="text-slate-600 mt-1">View and manage all your previous assessments</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Predictions</CardTitle>
            <CardDescription>{predictions.length} assessments on record</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {predictions.map((pred) => (
                <div
                  key={pred.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium text-slate-900">{pred.date}</p>
                        <p className="text-sm text-slate-600">{pred.features}</p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-2xl font-bold text-slate-900">{pred.score}%</p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            pred.category === 'High'
                              ? 'bg-red-100 text-red-700'
                              : pred.category === 'Moderate'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {pred.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
