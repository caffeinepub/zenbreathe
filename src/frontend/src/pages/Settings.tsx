import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Bell, Volume2, Vibrate, Moon, Smartphone } from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();

  return (
    <div className="container max-w-2xl py-6 px-4 space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/' })}
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-semibold">Settings</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Audio Settings
          </CardTitle>
          <CardDescription>Configure voice guidance and ambient sounds</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="voice-guidance">Voice Guidance</Label>
              <p className="text-sm text-muted-foreground">
                Spoken instructions during exercises
              </p>
            </div>
            <Switch id="voice-guidance" defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="ambient-sound">Ambient Sounds</Label>
              <p className="text-sm text-muted-foreground">
                Background nature sounds
              </p>
            </div>
            <Switch id="ambient-sound" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vibrate className="h-5 w-5" />
            Haptic Feedback
          </CardTitle>
          <CardDescription>Vibration during phase transitions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="haptics">Enable Haptics</Label>
              <p className="text-sm text-muted-foreground">
                Gentle vibrations on phase changes
              </p>
            </div>
            <Switch id="haptics" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Reminders and daily practice goals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="daily-reminder">Daily Reminder</Label>
              <p className="text-sm text-muted-foreground">
                Remind me to practice daily
              </p>
            </div>
            <Switch id="daily-reminder" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="streak-notifications">Streak Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Celebrate practice milestones
              </p>
            </div>
            <Switch id="streak-notifications" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Display
          </CardTitle>
          <CardDescription>Screen and appearance settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="keep-screen-on">Keep Screen On</Label>
              <p className="text-sm text-muted-foreground">
                Prevent screen from dimming during exercises
              </p>
            </div>
            <Switch id="keep-screen-on" defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">
                <Moon className="inline h-4 w-4 mr-1" />
                Dark Mode
              </Label>
              <p className="text-sm text-muted-foreground">
                Use dark theme (coming soon)
              </p>
            </div>
            <Switch id="dark-mode" disabled />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data & Privacy</CardTitle>
          <CardDescription>Manage your data and privacy preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            Export My Data
          </Button>
          <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
            Clear All Data
          </Button>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground pt-4">
        <p>All settings are stored locally on your device</p>
      </div>
    </div>
  );
}
