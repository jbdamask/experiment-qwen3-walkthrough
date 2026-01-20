import { MainLayout } from "./components/MainLayout";
import { WelcomeSection } from "./components/WelcomeSection";
import { CapabilitiesSection } from "./components/CapabilitiesSection";
import { UseCasesSection } from "./components/UseCasesSection";
import { TextPromptInput } from "./components/TextPromptInput";
import { ImageUpload } from "./components/ImageUpload";

function App() {
  const handlePromptSubmit = (prompt: string) => {
    console.log("Submitted prompt:", prompt);
    // TODO: Handle prompt submission in future stories
  };

  const handleImageChange = (file: File | null) => {
    console.log("Image changed:", file?.name ?? "cleared");
    // TODO: Handle image change in future stories
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <WelcomeSection />
        <CapabilitiesSection />
        <UseCasesSection />
        <ImageUpload onImageChange={handleImageChange} />
        <TextPromptInput onSubmit={handlePromptSubmit} />
      </div>
    </MainLayout>
  );
}

export default App;
