import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet, useRouterState } from '@tanstack/react-router';
import Home from './pages/Home';
import Player from './pages/Player';
import Test from './pages/Test';
import Stats from './pages/Stats';
import Custom from './pages/Custom';
import About from './pages/About';
import Settings from './pages/Settings';
import ExerciseInfo from './pages/ExerciseInfo';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutGrid, BarChart3, Sliders, Heart, Settings as SettingsIcon } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

function Layout() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const getActiveTab = () => {
    if (currentPath === '/') return 'default';
    if (currentPath === '/custom') return 'custom';
    if (currentPath === '/stats') return 'progress';
    return 'default';
  };

  // Hide footer on player and exercise-info routes
  const showFooter = currentPath !== '/player' && currentPath !== '/exercise-info';
  
  // Show Home-specific header icons only on Home route
  const isHomePage = currentPath === '/';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card px-3 sm:px-4 py-2.5 sm:py-3">
        <div className="flex items-center justify-between">
          {isHomePage && (
            <button
              onClick={() => navigate({ to: '/about' })}
              className="p-1.5 sm:p-2 hover:bg-muted rounded-full transition-colors"
              aria-label="About"
            >
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-foreground/60" />
            </button>
          )}
          
          {!isHomePage && <div className="w-8 sm:w-10" />}
          
          <h1 className="text-lg sm:text-xl font-semibold text-foreground">ZenBreathe</h1>
          
          {isHomePage && (
            <button
              onClick={() => navigate({ to: '/settings' })}
              className="p-1.5 sm:p-2 hover:bg-muted rounded-full transition-colors"
              aria-label="Settings"
            >
              <SettingsIcon className="h-5 w-5 sm:h-6 sm:w-6 text-foreground/60" />
            </button>
          )}
          
          {!isHomePage && <div className="w-8 sm:w-10" />}
        </div>
      </header>
      
      <main className={`flex-1 overflow-auto w-full max-w-[480px] mx-auto ${showFooter ? 'pb-[calc(4rem+1rem)]' : ''}`}>
        <Outlet />
      </main>

      {showFooter && (
        <footer className="fixed bottom-0 left-0 right-0 border-t bg-card z-50">
          <Tabs value={getActiveTab()} className="w-full">
            <TabsList className="w-full h-14 sm:h-16 rounded-none grid grid-cols-3">
              <TabsTrigger 
                value="default" 
                className="flex flex-col gap-0.5 sm:gap-1"
                onClick={() => navigate({ to: '/' })}
              >
                <LayoutGrid className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-[10px] sm:text-xs">Default</span>
              </TabsTrigger>
              <TabsTrigger 
                value="custom" 
                className="flex flex-col gap-0.5 sm:gap-1"
                onClick={() => navigate({ to: '/custom' })}
              >
                <Sliders className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-[10px] sm:text-xs">Custom</span>
              </TabsTrigger>
              <TabsTrigger 
                value="progress" 
                className="flex flex-col gap-0.5 sm:gap-1"
                onClick={() => navigate({ to: '/stats' })}
              >
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-[10px] sm:text-xs">Progress</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </footer>
      )}
    </div>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const playerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/player',
  component: Player,
});

const testRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/test',
  component: Test,
});

const statsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/stats',
  component: Stats,
});

const customRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/custom',
  component: Custom,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: About,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: Settings,
});

const exerciseInfoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/exercise-info',
  component: ExerciseInfo,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  playerRoute,
  testRoute,
  statsRoute,
  customRoute,
  aboutRoute,
  settingsRoute,
  exerciseInfoRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
