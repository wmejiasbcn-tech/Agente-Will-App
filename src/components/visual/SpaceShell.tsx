import React from 'react';

export type WillScene = 'chat' | 'topics' | 'resources' | 'how-it-works';

const SCENE: Record<
  WillScene,
  {
    photo: string;
    photoMobile?: string;
    position: string;
    marks: Array<'sphere' | 'ribbon' | 'geometry' | 'prism' | 'ring'>;
  }
> = {
  chat: {
    photo: '/visual-system/space-page09.jpg?v=txt2',
    photoMobile: '/visual-system/space-page09-mobile.jpg?v=txt2',
    position: '70% 58%',
    marks: [],
  },
  topics: {
    photo: '/visual-system/interior-page05.jpg?v=fid',
    position: '78% 48%',
    marks: [],
  },
  resources: {
    photo: '/visual-system/interior-page10.jpg?v=fid',
    position: '48% 50%',
    marks: [],
  },
  'how-it-works': {
    photo: '/visual-system/waves-page03.jpg?v=fid',
    position: '80% 45%',
    marks: [],
  },
};

interface SpaceShellProps {
  scene: WillScene;
  children: React.ReactNode;
}

export const SpaceShell: React.FC<SpaceShellProps> = ({ scene, children }) => {
  const cfg = SCENE[scene];

  return (
    <div className="relative min-h-dvh h-dvh overflow-hidden text-[#e8d4b0] flex flex-col font-sans selection:bg-amber-900/40 selection:text-amber-100">
      <picture className="will-photo-layer" aria-hidden="true">
        {cfg.photoMobile && (
          <source media="(max-width: 767px)" srcSet={cfg.photoMobile} />
        )}
        <img
          src={cfg.photo}
          alt=""
          className={scene === 'chat' ? 'will-photo will-photo-chat' : 'will-photo'}
          style={{ objectPosition: cfg.position }}
        />
      </picture>
      <div className={`will-veil will-veil-${scene}`} aria-hidden="true" />
      <div className="will-light-breath" aria-hidden="true" />

      {cfg.marks.includes('sphere') && (
        <img
          src="/visual-system/sphere-page08.webp?v=fid"
          alt=""
          aria-hidden="true"
          className="will-mark will-mark-sphere"
        />
      )}
      {cfg.marks.includes('geometry') && (
        <img
          src="/visual-system/geometry-page02.webp?v=fid"
          alt=""
          aria-hidden="true"
          className="will-mark will-mark-geometry"
        />
      )}
      {cfg.marks.includes('prism') && (
        <img
          src="/visual-system/prism-page07.webp?v=fid"
          alt=""
          aria-hidden="true"
          className="will-mark will-mark-prism"
        />
      )}
      {cfg.marks.includes('ribbon') && (
        <img
          src="/visual-system/ribbon-page04.webp?v=fid"
          alt=""
          aria-hidden="true"
          className="will-mark will-mark-ribbon"
        />
      )}
      {cfg.marks.includes('ring') && (
        <img
          src="/visual-system/ring-page11.webp?v=fid"
          alt=""
          aria-hidden="true"
          className="will-mark will-mark-ring"
        />
      )}

      <div className="relative z-10 flex flex-col flex-1 min-h-0">{children}</div>
    </div>
  );
};
