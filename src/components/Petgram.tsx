import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Camera,
  Plus,
  Send,
  X,
  Sparkles,
  Filter,
} from 'lucide-react';
import { PetgramPost, PetProfile } from '../types';

interface PetgramProps {
  posts: PetgramPost[];
  onAddPost: (post: PetgramPost) => void;
  activePet?: PetProfile;
}

export const Petgram: React.FC<PetgramProps> = ({
  posts: initialPosts,
  onAddPost,
  activePet,
}) => {
  const [posts, setPosts] = useState<PetgramPost[]>(initialPosts);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [activeStory, setActiveStory] = useState<{
    name: string;
    img: string;
    text: string;
    avatar?: string;
  } | null>(null);

  // Form state
  const [newCaption, setNewCaption] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newTags, setNewTags] = useState('#DogsofPetwrld, #HappyPaws');

  // Comment input per post
  const [commentInputs, setCommentInputs] = useState<{ [id: string]: string }>({});

  const petStories = [
    {
      name: activePet?.name || 'Milo',
      avatar: activePet?.avatarUrl || 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=150&q=80',
      img: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=700&q=80',
      text: 'Morning beach run was epic! 🐾',
    },
    {
      name: 'Cleo',
      avatar: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=150&q=80',
      img: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=700&q=80',
      text: 'Fittings for the Petwrld Fashion Gala!',
    },
    {
      name: 'Luna',
      avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=150&q=80',
      img: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=700&q=80',
      text: 'Napping in the sunbeam ☀️',
    },
    {
      name: 'Bella',
      avatar: 'https://images.unsplash.com/photo-1612536057832-2ff7ead58194?auto=format&fit=crop&w=150&q=80',
      img: 'https://images.unsplash.com/photo-1612536057832-2ff7ead58194?auto=format&fit=crop&w=700&q=80',
      text: 'Corgi zoomies in the grass!',
    },
    {
      name: 'Rocky',
      avatar: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=150&q=80',
      img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=700&q=80',
      text: 'Graduated puppy obedience school today! 🎓',
    },
  ];

  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likes: isLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newComment = {
            id: `c-${Date.now()}`,
            author: activePet?.name || 'Pet Lover',
            avatar: activePet?.avatarUrl || 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=100&q=80',
            text,
            timestamp: 'Just now',
          };
          return { ...p, comments: [...p.comments, newComment] };
        }
        return p;
      })
    );
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const handleSubmitNewPetgram = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost: PetgramPost = {
      id: `pg-${Date.now()}`,
      petName: activePet?.name || 'Milo',
      petHandle: `@${(activePet?.name || 'milo').toLowerCase()}_adventures`,
      petAvatar: activePet?.avatarUrl || 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=200&q=80',
      breed: activePet?.breed || 'Golden Retriever',
      imageUrl:
        newImageUrl ||
        'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
      caption: newCaption,
      likes: 1,
      isLiked: true,
      timestamp: 'Just now',
      tags: newTags.split(',').map((t) => t.trim()),
      comments: [],
    };
    setPosts([newPost, ...posts]);
    onAddPost(newPost);
    setNewCaption('');
    setNewImageUrl('');
    setIsPostModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Petgram Header */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="max-w-xl space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-xs">
            <Camera className="w-3.5 h-3.5 text-pink-200" />
            <span>Pet Social Media Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Petgram
          </h1>
          <p className="text-xs sm:text-sm text-pink-100 leading-relaxed">
            Create profiles for your pets, share moments, post photos & 24-hour stories, and connect with pet lovers around the globe.
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="inline-flex items-center gap-2 bg-white text-rose-600 hover:bg-rose-50 font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Petgram Post</span>
          </button>
        </div>
      </div>

      {/* Stories Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 overflow-x-auto scrollbar-none shadow-xs">
        <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2.5">
          Live 24H Pet Stories
        </div>
        <div className="flex items-center gap-4 min-w-max">
          {/* Add Story Button */}
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-stone-300 flex items-center justify-center bg-stone-50 group-hover:border-rose-400 transition-colors">
              <Plus className="w-5 h-5 text-stone-400 group-hover:text-rose-500" />
            </div>
            <span className="text-[11px] font-medium text-stone-600">Your Story</span>
          </button>

          {petStories.map((story, i) => (
            <button
              key={i}
              onClick={() => setActiveStory(story)}
              className="flex flex-col items-center gap-1 group"
            >
              <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 group-hover:scale-105 transition-transform">
                <img
                  src={story.avatar}
                  alt={story.name}
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                />
              </div>
              <span className="text-[11px] font-medium text-stone-800 truncate w-14 text-center">
                {story.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Posts Feed */}
      <div className="max-w-xl mx-auto space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs"
          >
            {/* Post Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-rose-500">
                  <img
                    src={post.petAvatar}
                    alt={post.petName}
                    className="w-full h-full rounded-full object-cover border border-white"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-stone-900">{post.petName}</span>
                    <span className="text-[10px] text-stone-400 font-medium">{post.petHandle}</span>
                  </div>
                  <div className="text-[10px] text-amber-700 font-semibold">{post.breed}</div>
                </div>
              </div>
              <span className="text-[11px] text-stone-400">{post.timestamp}</span>
            </div>

            {/* Post Image */}
            <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
              <img src={post.imageUrl} alt="Pet Post" className="w-full h-full object-cover" />
            </div>

            {/* Actions */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLikePost(post.id)}
                    className={`flex items-center gap-1.5 text-xs font-semibold transition-transform active:scale-125 ${
                      post.isLiked ? 'text-rose-600' : 'text-stone-600 hover:text-rose-600'
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${post.isLiked ? 'fill-rose-600 text-rose-600' : ''}`}
                    />
                    <span>{post.likes}</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-600">
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.comments.length}</span>
                  </div>

                  <button className="text-stone-600 hover:text-stone-900">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
                <button className="text-stone-400 hover:text-stone-700">
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>

              {/* Caption & Tags */}
              <div className="text-xs text-stone-800 leading-relaxed">
                <strong className="text-stone-900 mr-1.5">{post.petName}</strong>
                {post.caption}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag, i) => (
                  <span key={i} className="text-[10px] text-rose-700 font-medium bg-rose-50 px-2 py-0.5 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Comments Thread */}
              {post.comments.length > 0 && (
                <div className="pt-2 border-t border-stone-100 space-y-2">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="text-[11px] flex items-start gap-2">
                      <img
                        src={comment.avatar}
                        alt={comment.author}
                        className="w-5 h-5 rounded-full object-cover mt-0.5"
                      />
                      <div>
                        <span className="font-bold text-stone-900 mr-1">{comment.author}</span>
                        <span className="text-stone-600">{comment.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment Input */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Comment as ${activePet?.name || 'Pet Parent'}...`}
                  value={commentInputs[post.id] || ''}
                  onChange={(e) =>
                    setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddComment(post.id);
                  }}
                  className="flex-1 text-xs border border-stone-200 rounded-lg px-3 py-1.5 outline-hidden focus:ring-1 focus:ring-rose-500"
                />
                <button
                  onClick={() => handleAddComment(post.id)}
                  className="p-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Story Preview Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="relative w-full max-w-sm aspect-9/16 rounded-2xl overflow-hidden shadow-2xl bg-black flex flex-col justify-between">
            <div className="absolute inset-0">
              <img src={activeStory.img} alt="Story" className="w-full h-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
            </div>

            {/* Story Top Bar */}
            <div className="relative z-10 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <img
                  src={activeStory.avatar}
                  alt={activeStory.name}
                  className="w-8 h-8 rounded-full border border-white"
                />
                <span className="font-bold text-xs">{activeStory.name}</span>
                <span className="text-[10px] text-stone-300">• 4h ago</span>
              </div>
              <button onClick={() => setActiveStory(null)} className="text-white hover:text-stone-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Story Bottom Text */}
            <div className="relative z-10 p-5 text-white space-y-2">
              <p className="text-sm font-semibold">{activeStory.text}</p>
              <button
                onClick={() => setActiveStory(null)}
                className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-xs rounded-xl text-xs font-bold"
              >
                Close Story
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Petgram Post Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-stone-200">
            <button
              onClick={() => setIsPostModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleSubmitNewPetgram} className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-rose-600">New Post</span>
                <h3 className="text-sm font-bold text-stone-900">Share on Petgram</h3>
              </div>

              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                <img
                  src={activePet?.avatarUrl || 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=150&q=80'}
                  alt="Pet"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-xs text-stone-900">{activePet?.name || 'Milo'}</div>
                  <div className="text-[10px] text-stone-400">@{activePet?.name?.toLowerCase() || 'milo'}_adventures</div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full text-xs p-2 border border-stone-300 rounded-lg outline-hidden"
                />
                <div className="flex gap-2 mt-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setNewImageUrl(
                        'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80'
                      )
                    }
                    className="text-[10px] text-rose-600 underline"
                  >
                    Use Sample Photo
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Caption</label>
                <textarea
                  required
                  rows={3}
                  placeholder="What is your pet up to today? 🐶🐱"
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  className="w-full text-xs p-2 border border-stone-300 rounded-lg outline-hidden"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Hashtags</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full text-xs p-2 border border-stone-300 rounded-lg outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
