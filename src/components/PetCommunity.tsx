import React, { useState } from 'react';
import { Camera, MessageSquare } from 'lucide-react';
import { PetgramPost, ForumPost, PetProfile } from '../types';
import { Petgram } from './Petgram';
import { Preddit } from './Preddit';

interface PetCommunityProps {
  petgramPosts: PetgramPost[];
  forumPosts: ForumPost[];
  onAddPetgramPost: (post: PetgramPost) => void;
  onAddForumPost: (post: ForumPost) => void;
  activePet?: PetProfile;
  initialSubTab?: 'petgram' | 'preddit';
}

export const PetCommunity: React.FC<PetCommunityProps> = ({
  petgramPosts,
  forumPosts,
  onAddPetgramPost,
  onAddForumPost,
  activePet,
  initialSubTab = 'petgram',
}) => {
  const [subTab, setSubTab] = useState<'petgram' | 'preddit'>(initialSubTab);

  return (
    <div className="space-y-6 pb-16">
      {/* Switcher Navigation */}
      <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubTab('petgram')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              subTab === 'petgram'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Petgram</span>
          </button>

          <button
            onClick={() => setSubTab('preddit')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              subTab === 'preddit'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-orange-400" />
            <span>Preddit</span>
          </button>
        </div>
      </div>

      {subTab === 'petgram' ? (
        <Petgram
          posts={petgramPosts}
          onAddPost={onAddPetgramPost}
          activePet={activePet}
        />
      ) : (
        <Preddit
          posts={forumPosts}
          onAddPost={onAddForumPost}
          activePet={activePet}
        />
      )}
    </div>
  );
};
