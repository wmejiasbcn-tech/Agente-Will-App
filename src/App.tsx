import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { WillChat } from './components/WillChat';
import { ExploreTopicsView } from './components/ExploreTopicsView';
import { ResourcesView } from './components/ResourcesView';
import { HowWillWorksView } from './components/HowWillWorksView';
import { EmergencyModal } from './components/EmergencyModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [currentDimension, setCurrentDimension] = useState<string>('all');
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string>('');
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);

  // Jump from any topic or resource card directly into the chat with a question
  const handleAskWill = (prompt: string, domainId?: string) => {
    setChatInitialPrompt(prompt);
    setActiveTab('chat');
  };

  return (
    <div className="min-h-dvh h-dvh bg-[#0A0A0B] text-stone-100 flex flex-col font-sans selection:bg-amber-900 selection:text-amber-100">
      <a href="#contenido-principal" className="skip-link">
        Saltar al contenido
      </a>

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
      />

      <main id="contenido-principal" className="flex-1 min-h-0 overflow-y-auto flex flex-col" tabIndex={-1}>
        {activeTab === 'chat' && (
          <WillChat
            currentDimension={currentDimension}
            setCurrentDimension={setCurrentDimension}
            initialPrompt={chatInitialPrompt}
            onClearInitialPrompt={() => setChatInitialPrompt('')}
          />
        )}

        {activeTab === 'topics' && (
          <ExploreTopicsView
            onAskWill={handleAskWill}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
          />
        )}

        {activeTab === 'resources' && (
          <ResourcesView
            onAskWill={handleAskWill}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
          />
        )}

        {activeTab === 'how-it-works' && (
          <HowWillWorksView
            onNavigateToChat={handleAskWill}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
          />
        )}
      </main>

      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />
    </div>
  );
}
