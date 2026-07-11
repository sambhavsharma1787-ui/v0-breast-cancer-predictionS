'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { PhotoUpload } from '@/components/photo-upload'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function NewPredictionPage() {
  const [selectedTab, setSelectedTab] = useState('photo')
  const [extractedData, setExtractedData] = useState<any>(null)

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">New Prediction</h2>
          <p className="text-slate-600 mt-1">Start a new breast cancer risk assessment</p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="photo">Upload Medical Image</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="document">Scan Document</TabsTrigger>
          </TabsList>

          {/* Photo Upload Tab */}
          <TabsContent value="photo" className="space-y-6">
            <PhotoUpload
              mode="all"
              onImageSelect={(file, preview) => {
                console.log('Image selected:', file.name)
              }}
              onExtractedData={(data) => {
                setExtractedData(data)
              }}
            />
          </TabsContent>

          {/* Manual Entry Tab */}
          <TabsContent value="manual" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manual Data Entry</CardTitle>
                <CardDescription>Enter cellular measurements and health information manually</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Manual prediction form coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Document Scan Tab */}
          <TabsContent value="document" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scan Medical Document</CardTitle>
                <CardDescription>Upload a scan of your medical report for automatic data extraction</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Document scanning feature coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
