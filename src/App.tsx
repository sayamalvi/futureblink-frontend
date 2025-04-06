import { FlowCanvas } from './components/FlowCanvas';

function App() {
  return (
    <div className="w-full h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Lead Flow Builder</h1>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <FlowCanvas />
        </div>
      </div>
    </div>
  );
}

export default App;
