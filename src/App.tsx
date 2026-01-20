import { MainLayout } from "./components/MainLayout";

function App() {
  return (
    <MainLayout>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          Welcome to Qwen3-VL Showcase
        </h2>
        <p className="text-slate-600">
          This interactive demo showcases the capabilities of Qwen3-VL-8B-Instruct,
          a powerful vision-language model for instruction following.
        </p>
        <p className="text-slate-500 text-sm mt-4">
          More features coming soon...
        </p>
      </div>
    </MainLayout>
  );
}

export default App;
