import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Settings</h2>
          <p className="text-slate-600 mt-1">Manage your account and preferences</p>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstname">First Name</Label>
                <Input id="firstname" placeholder="John" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="lastname">Last Name</Label>
                <Input id="lastname" placeholder="Doe" className="mt-2" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="john@example.com" className="mt-2" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Privacy & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy & Notifications</CardTitle>
            <CardDescription>Control how your data is used</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-slate-600 mt-1">Get alerts for high-risk predictions</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Weekly Summary</Label>
                <p className="text-sm text-slate-600 mt-1">Receive weekly health summary reports</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Data Sharing</Label>
                <p className="text-sm text-slate-600 mt-1">Allow research use of anonymized data</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* API Integration */}
        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Manage API keys for third-party integrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-slate-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Production API Key</p>
                    <p className="text-sm text-slate-600 mt-1">pk_live_••••••••••••••••</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Copy</Button>
                    <Button size="sm" variant="outline">Regenerate</Button>
                  </div>
                </div>
              </div>
            </div>
            <Button>Create New API Key</Button>
            <p className="text-sm text-slate-600">
              API keys allow external applications to access your data. Keep them secure and never share them.
            </p>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="password">Change Password</Label>
              <Input id="password" type="password" placeholder="Current password" className="mt-2" />
              <Input type="password" placeholder="New password" className="mt-2" />
              <Input type="password" placeholder="Confirm new password" className="mt-2" />
              <Button className="mt-4">Update Password</Button>
            </div>
            <div className="border-t pt-6">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-slate-600 mt-2">Add an extra layer of security to your account</p>
              <Button variant="outline" className="mt-4">Enable 2FA</Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium">Delete All Predictions</p>
              <p className="text-sm text-slate-600 mt-1">Permanently delete all your prediction history</p>
              <Button variant="outline" className="mt-4 text-red-600 hover:text-red-700">
                Delete All Data
              </Button>
            </div>
            <div>
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-slate-600 mt-1">Permanently delete your account and all associated data</p>
              <Button variant="outline" className="mt-4 text-red-600 hover:text-red-700">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
