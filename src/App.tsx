import { useState, useMemo, useCallback, useEffect } from "react";
import { MainLayout } from "./components/MainLayout";
import { WelcomeSection } from "./components/WelcomeSection";
import { CapabilitiesSection } from "./components/CapabilitiesSection";
import { UseCasesSection } from "./components/UseCasesSection";
import { TextPromptInput } from "./components/TextPromptInput";
import { ImageInput } from "./components/ImageInput";
import { InputPreviewPanel } from "./components/InputPreviewPanel";
import { ResponseDisplay } from "./components/ResponseDisplay";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { ErrorMessage, ValidationError } from "./components/ErrorMessage";
import { generateCompletion } from "./utils/api";
import { useSession } from "./hooks/useSession";

function App() {
  const [prompt, setPrompt] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Response state for displaying model output
  const [response, setResponse] = useState<string | null>(null);
  const [lastSubmittedPrompt, setLastSubmittedPrompt] = useState<string | null>(null);
  const [lastSubmittedImageUrl, setLastSubmittedImageUrl] = useState<string | null>(null);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Session context for history management
  const { addExchange, selectedExchangeId, getExchangeById, selectExchange } = useSession();

  // Get the selected exchange from history
  const selectedExchange = selectedExchangeId ? getExchangeById(selectedExchangeId) : null;

  // Display values - either from selected exchange or current state
  const displayResponse = selectedExchange?.response ?? response;
  const displayPrompt = selectedExchange?.prompt ?? lastSubmittedPrompt;
  const displayImageUrl = selectedExchange?.imageUrl ?? lastSubmittedImageUrl;

  // Clear selection when user starts typing a new prompt
  useEffect(() => {
    if (prompt.trim() && selectedExchangeId) {
      selectExchange(null);
    }
  }, [prompt, selectedExchangeId, selectExchange]);

  // Create a preview URL for the submitted image file
  const responseImageUrl = useMemo(() => {
    // Use imageUrl if available, otherwise create object URL for file
    if (displayImageUrl) {
      return displayImageUrl;
    }
    return null;
  }, [displayImageUrl]);

  const handlePromptChange = (newPrompt: string) => {
    setPrompt(newPrompt);
  };

  // Validate inputs before submission
  const validateInputs = useCallback((): string[] => {
    const errors: string[] = [];

    if (!prompt.trim()) {
      errors.push("Please enter a text prompt");
    }

    if (prompt.length > 4000) {
      errors.push("Prompt exceeds maximum length of 4000 characters");
    }

    return errors;
  }, [prompt]);

  const handlePromptSubmit = useCallback(async (submittedPrompt: string) => {
    // Validate inputs first
    const errors = validateInputs();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Clear previous errors and start loading
    setValidationErrors([]);
    setError(null);
    setIsLoading(true);

    // Store the submitted prompt and image for the response display
    setLastSubmittedPrompt(submittedPrompt);

    // Store image URL for response display context
    let currentImageUrl: string | null = null;
    if (imageFile) {
      currentImageUrl = URL.createObjectURL(imageFile);
      setLastSubmittedImageUrl(currentImageUrl);
    } else if (imageUrl) {
      currentImageUrl = imageUrl;
      setLastSubmittedImageUrl(imageUrl);
    } else {
      setLastSubmittedImageUrl(null);
    }

    try {
      // Prepare image data for API call
      let imageData: { type: "file"; file: File } | { type: "url"; url: string } | undefined;
      if (imageFile) {
        imageData = { type: "file", file: imageFile };
      } else if (imageUrl) {
        imageData = { type: "url", url: imageUrl };
      }

      // Call the API
      const result = await generateCompletion(submittedPrompt, imageData);
      setResponse(result.content);

      // Add to session history
      addExchange({
        prompt: submittedPrompt,
        response: result.content,
        imageUrl: currentImageUrl,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      setResponse(null);
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, imageUrl, validateInputs, addExchange]);

  const handleRetry = useCallback(() => {
    if (lastSubmittedPrompt) {
      handlePromptSubmit(lastSubmittedPrompt);
    }
  }, [lastSubmittedPrompt, handlePromptSubmit]);

  const handleDismissError = useCallback(() => {
    setError(null);
  }, []);

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

        {/* Validation errors */}
        {validationErrors.length > 0 && (
          <ValidationError errors={validationErrors} />
        )}

        {/* Loading state */}
        {isLoading && (
          <LoadingSpinner message="Qwen3-VL is analyzing your input..." />
        )}

        {/* Error state */}
        {error && !isLoading && (
          <ErrorMessage
            title="API Error"
            message={error}
            onRetry={handleRetry}
            onDismiss={handleDismissError}
          />
        )}

        {/* Response display - show either current response or selected history item */}
        {displayResponse && !isLoading && (
          <ResponseDisplay
            response={displayResponse}
            promptPreview={displayPrompt ?? undefined}
            imagePreviewUrl={responseImageUrl}
          />
        )}
      </div>
    </MainLayout>
  );
}

export default App;
