import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { WillChat } from './components/WillChat';
import { ExploreTopicsView } from './components/ExploreTopicsView';
import { ResourcesView } from './components/ResourcesView';
import { HowWillWorksView } from './components/HowWillWorksView';
import { EmergencyModal } from './components/EmergencyModal';
import { SpaceShell, WillScene } from './components/visual/SpaceShell';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [currentDimension, setCurrentDimension] = useState<string>('all');
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string>('');
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);

  const handleAskWill = (prompt: string, domainId?: string) => {
    setChatInitialPrompt(prompt);
    setActiveTab('chat');
  };

  const scene: WillScene =
    activeTab === 'topics'
      ? 'topics'
      : activeTab === 'resources'
        ? 'resources'
        : activeTab === 'how-it-works'
          ? 'how-it-works'
          : 'chat';

  return (
    <SpaceShell scene={scene}>
      <a href="#contenido-principal" className="skip-link">
        Saltar al contenido
      </a>

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
      />

      <main
        id="contenido-principal"
        className="relative z-10 flex-1 min-h-0 overflow-y-auto flex flex-col"
        tabIndex={-1}
      >
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
    </SpaceShell>
  );
}
