import React, { useState } from "react";
import LeadForm from "../components/LeadForm";
import LeadList from "../components/LeadList";

const App = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLeadAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Lead Management System</h1>
          <p className="text-gray-600">Capture and manage your leads efficiently</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
          <div className="lg:col-span-1">
            <LeadForm onLeadAdded={handleLeadAdded} />
          </div>

          
          <div className="lg:col-span-2">
            <LeadList key={refreshKey} />
          </div>
        </div>

      
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Built with React, TypeScript, Tailwind CSS, Express.js & MongoDB</p>
        </div>
      </div>
    </div>
  );
};

export default App;