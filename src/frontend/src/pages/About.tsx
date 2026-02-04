import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ArrowLeft, Sparkles } from 'lucide-react';

export default function About() {
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
        <h2 className="text-2xl font-semibold">About Breathe</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            About This App
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground/80">
            Breathe is a mindful breathing companion designed to help you relax, focus, and improve your overall well-being through guided breathing exercises.
          </p>
          <p className="text-foreground/80">
            Whether you're looking to reduce stress, improve sleep, or simply take a moment to center yourself, our carefully crafted breathing patterns are here to support your journey.
          </p>
        </CardContent>
      </Card>

      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Upgrade to Premium
          </CardTitle>
          <CardDescription>
            Unlock advanced features and support development
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2 text-sm text-foreground/80">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>Unlimited custom breathing patterns</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>Advanced analytics and insights</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>Exclusive ambient soundscapes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>Priority support</span>
            </li>
          </ul>
          <Button className="w-full" size="lg">
            Upgrade Now - $4.99/month
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Payment integration coming soon
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium">Default Session Duration</span>
            <span className="text-sm text-muted-foreground">5 minutes</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium">Voice Guidance</span>
            <span className="text-sm text-muted-foreground">Enabled</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium">Haptic Feedback</span>
            <span className="text-sm text-muted-foreground">Enabled</span>
          </div>
          <Button variant="outline" className="w-full" onClick={() => navigate({ to: '/settings' })}>
            View All Settings
          </Button>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground pt-4">
        <p>Version 1.0.0</p>
        <p className="mt-2">
          © 2026. Built with <Heart className="inline h-3 w-3 text-red-500" /> using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
