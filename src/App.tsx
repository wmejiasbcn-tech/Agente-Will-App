import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { WillChat } from './components/WillChat';
import { ExploreTopicsView } from './components/ExploreTopicsView';
import { ResourcesView } from './components/ResourcesView';
import { HowWillWorksView } from './components/HowWillWorksView';
import { OtherResourcesView } from './components/OtherResourcesView';
import { EmergencyModal } from './components/EmergencyModal';
import { SpaceShell, WillScene } from './components/visual/SpaceShell';
import { PagerArrows } from './components/PagerArrows';

const SCENES = ['chat', 'topics', 'resources', 'how-it-works', 'other-resources'] as const;

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
          : activeTab === 'other-resources'
            ? 'other-resources'
            : 'chat';

  const sceneIndex = SCENES.indexOf(activeTab as (typeof SCENES)[number]);
  const goPrevScene = () => {
    if (sceneIndex > 0) setActiveTab(SCENES[sceneIndex - 1]);
  };
  const goNextScene = () => {
    if (sceneIndex < SCENES.length - 1) setActiveTab(SCENES[sceneIndex + 1]);
  };

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
            onGoNextScene={goNextScene}
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

        {activeTab === 'other-resources' && (
          <OtherResourcesView onAskWill={handleAskWill} />
        )}
      </main>

      {activeTab !== 'chat' && (
        <div className="relative z-10 shrink-0 px-5 sm:px-8 pb-4 pt-1">
          <div className="max-w-6xl mx-auto">
            <PagerArrows
              onBack={goPrevScene}
              onNext={goNextScene}
              backDisabled={sceneIndex <= 0}
              nextDisabled={sceneIndex >= SCENES.length - 1}
            />
          </div>
        </div>
      )}

      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />
    </SpaceShell>
  );
}
