import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

import Dashboard from "./pages/Dashboard";

import { SidebarLayout } from "./components/SidebarLayout";
import NotFound from "./pages/NotFound";

function Router() {
  return (
    <SidebarLayout>
      <Switch>
        <Route path="/" component={Home} />

        <Route path="/dashboard" component={Dashboard} />

        <Route path="/404" component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </SidebarLayout>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <ErrorBoundary>
        <Router />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
