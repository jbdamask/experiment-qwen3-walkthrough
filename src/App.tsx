import { MainLayout } from "./components/MainLayout";
import { WelcomeSection } from "./components/WelcomeSection";
import { CapabilitiesSection } from "./components/CapabilitiesSection";
import { UseCasesSection } from "./components/UseCasesSection";
import { TextPromptInput } from "./components/TextPromptInput";
import { ImageInput } from "./components/ImageInput";

function App() {
  const handlePromptSubmit = (prompt: string) => {
    console.log("Submitted prompt:", prompt);
    // TODO: Handle prompt submission in future stories
  };

  const handleImageChange = (data: { file: File | null; url: string | null }) => {
    if (data.file) {
      console.log("Image file uploaded:", data.file.name);
    } else if (data.url) {
      console.log("Image URL provided:", data.url);
    } else {
      console.log("Image cleared");
    }
    // TODO: Handle image change in future stories
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <WelcomeSection />
        <CapabilitiesSection />
        <UseCasesSection />
        <ImageInput onImageChange={handleImageChange} />
        <TextPromptInput onSubmit={handlePromptSubmit} />
      </div>
    </MainLayout>
  );
}

export default App;
