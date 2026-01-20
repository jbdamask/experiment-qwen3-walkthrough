import { useState, useMemo } from "react";
import { MainLayout } from "./components/MainLayout";
import { WelcomeSection } from "./components/WelcomeSection";
import { CapabilitiesSection } from "./components/CapabilitiesSection";
import { UseCasesSection } from "./components/UseCasesSection";
import { TextPromptInput } from "./components/TextPromptInput";
import { ImageInput } from "./components/ImageInput";
import { InputPreviewPanel } from "./components/InputPreviewPanel";
import { ResponseDisplay } from "./components/ResponseDisplay";

function App() {
  const [prompt, setPrompt] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Response state for displaying model output
  const [response, setResponse] = useState<string | null>(null);
  const [lastSubmittedPrompt, setLastSubmittedPrompt] = useState<string | null>(null);
  const [lastSubmittedImageUrl, setLastSubmittedImageUrl] = useState<string | null>(null);

  // Create a preview URL for the submitted image file
  const responseImageUrl = useMemo(() => {
    // Use imageUrl if available, otherwise create object URL for file
    if (lastSubmittedImageUrl) {
      return lastSubmittedImageUrl;
    }
    return null;
  }, [lastSubmittedImageUrl]);

  const handlePromptChange = (newPrompt: string) => {
    setPrompt(newPrompt);
  };

  const handlePromptSubmit = (submittedPrompt: string) => {
    console.log("Submitted prompt:", submittedPrompt);

    // Store the submitted prompt and image for the response display
    setLastSubmittedPrompt(submittedPrompt);

    // Store image URL for response display context
    if (imageFile) {
      // Create an object URL for the file to display in response
      setLastSubmittedImageUrl(URL.createObjectURL(imageFile));
    } else if (imageUrl) {
      setLastSubmittedImageUrl(imageUrl);
    } else {
      setLastSubmittedImageUrl(null);
    }

    // For now, show a placeholder response
    // This will be replaced with actual API call in a future story (US-010)
    setResponse(
      `This is a **demo response** from the Qwen3-VL model.\n\n` +
      `You asked: "${submittedPrompt.substring(0, 100)}${submittedPrompt.length > 100 ? '...' : ''}"\n\n` +
      `### Key Observations\n\n` +
      `1. The model processed your input\n` +
      `2. Image analysis was performed\n` +
      `3. Context was understood\n\n` +
      `> This is placeholder text. The actual API integration will be implemented in a later story.`
    );
  };

  const handleImageChange = (data: { file: File | null; url: string | null }) => {
    setImageFile(data.file);
    setImageUrl(data.url);

    if (data.file) {
      console.log("Image file uploaded:", data.file.name);
    } else if (data.url) {
      console.log("Image URL provided:", data.url);
    } else {
      console.log("Image cleared");
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <WelcomeSection />
        <CapabilitiesSection />
        <UseCasesSection />
        <ImageInput onImageChange={handleImageChange} />
        <TextPromptInput
          onSubmit={handlePromptSubmit}
          onChange={handlePromptChange}
          value={prompt}
        />
        <InputPreviewPanel
          prompt={prompt}
          imageFile={imageFile}
          imageUrl={imageUrl}
        />
        {response && (
          <ResponseDisplay
            response={response}
            promptPreview={lastSubmittedPrompt ?? undefined}
            imagePreviewUrl={responseImageUrl}
          />
        )}
      </div>
    </MainLayout>
  );
}

export default App;
