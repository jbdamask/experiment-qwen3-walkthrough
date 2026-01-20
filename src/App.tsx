import { MainLayout } from "./components/MainLayout";
import { WelcomeSection } from "./components/WelcomeSection";
import { CapabilitiesSection } from "./components/CapabilitiesSection";
import { UseCasesSection } from "./components/UseCasesSection";

function App() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <WelcomeSection />
        <CapabilitiesSection />
        <UseCasesSection />
      </div>
    </MainLayout>
  );
}

export default App;
