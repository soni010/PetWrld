import React, { useState } from 'react';
import {
  MessageSquare,
  ArrowBigUp,
  ArrowBigDown,
  MessageCircle,
  Share2,
  Plus,
  Send,
  X,
  Flame,
  Clock,
  Trophy,
  Search,
  Tag,
  Sparkles,
} from 'lucide-react';
import { ForumPost, PetProfile } from '../types';

interface PredditProps {
  posts: ForumPost[];
  onAddPost: (post: ForumPost) => void;
  activePet?: PetProfile;
}

export const Preddit: React.FC<PredditProps> = ({
  posts: initialPosts,
  onAddPost,
  activePet,
}) => {
  const [forums, setForums] = useState<ForumPost[]>(initialPosts);
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top'>('hot');
  const [isForumModalOpen, setIsForumModalOpen] = useState(false);

  // New Forum Post Form State
  const [newChannel, setNewChannel] = useState('p/PetStories');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  // Comment input per discussion
  const [expandedComments, setExpandedComments] = useState<{ [id: string]: boolean }>({});
  const [commentInputs, setCommentInputs] = useState<{ [id: string]: string }>({});

  const forumChannels = [
    { id: 'all', label: 'All Channels' },
    { id: 'p/DogTraining', label: 'p/DogTraining' },
    { id: 'p/VetQuestions', label: 'p/VetQuestions' },
    { id: 'p/PetStories', label: 'p/PetStories' },
    { id: 'p/AdoptionSuccess', label: 'p/AdoptionSuccess' },
  ];

  const handleVoteForum = (postId: string, direction: 1 | -1) => {
    setForums((prev) =>
      prev.map((f) => {
        if (f.id === postId) {
          const currentVote = f.userVote || 0;
          let newVote: 1 | -1 | 0 = direction;
          let voteDiff: number = direction;

          if (currentVote === direction) {
            newVote = 0;
            voteDiff = -direction;
          } else if (currentVote !== 0) {
            voteDiff = direction * 2;
          }

          return {
            ...f,
            upvotes: f.upvotes + voteDiff,
            userVote: newVote,
          };
        }
        return f;
      })
    );
  };

  const handleAddForumComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    setForums((prev) =>
      prev.map((f) => {
        if (f.id === postId) {
          const newComment = {
            id: `fc-${Date.now()}`,
            author: `u/Owner_of_${activePet?.name || 'Buddy'}`,
            content: text,
            timestamp: 'Just now',
            upvotes: 1,
          };
          return {
            ...f,
            commentsCount: f.commentsCount + 1,
            comments: [...(f.comments || []), newComment],
          };
        }
        return f;
      })
    );
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    setExpandedComments((prev) => ({ ...prev, [postId]: true }));
  };

  const handleSubmitNewForum = (e: React.FormEvent) => {
    e.preventDefault();
    const newFPost: ForumPost = {
      id: `forum-${Date.now()}`,
      channel: newChannel,
      author: `Owner_of_${activePet?.name || 'Buddy'}`,
      petBadge: `${activePet?.breed || 'Pet'} Parent`,
      title: newTitle,
      content: newContent,
      upvotes: 1,
      userVote: 1,
      commentsCount: 0,
      timestamp: 'Just now',
      tags: ['Community', 'Experience'],
      comments: [],
    };
    setForums([newFPost, ...forums]);
    onAddPost(newFPost);
    setNewTitle('');
    setNewContent('');
    setIsForumModalOpen(false);
  };

  const filteredForums = forums
    .filter((f) => {
      const matchChannel = selectedChannel === 'all' || f.channel === selectedChannel;
      const matchSearch =
        searchQuery === '' ||
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.channel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchChannel && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'top') return b.upvotes - a.upvotes;
      if (sortBy === 'new') return b.id.localeCompare(a.id);
      return b.upvotes * 2 + (b.commentsCount || 0) - (a.upvotes * 2 + (a.commentsCount || 0));
    });

  return (
    <div className="space-y-6 pb-16">
      {/* Preddit Header */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-stone-800 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="max-w-xl space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-xs">
            <MessageSquare className="w-3.5 h-3.5 text-amber-200" />
            <span>Pet Discussions & Advice Forum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Preddit
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
            The dedicated forum for pet lovers. Ask questions, share training experiences, post vet inquiries, and connect with experienced pet owners across channels.
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsForumModalOpen(true)}
            className="inline-flex items-center gap-2 bg-white text-orange-700 hover:bg-orange-50 font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Discussion</span>
          </button>
        </div>
      </div>

      {/* Controls Bar: Channel Filter, Search & Sort */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search topics, questions, breeds..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-lg outline-hidden focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-stone-100 p-1 rounded-lg">
            <button
              onClick={() => setSortBy('hot')}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                sortBy === 'hot' ? 'bg-white text-orange-600 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Hot</span>
            </button>
            <button
              onClick={() => setSortBy('new')}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                sortBy === 'new' ? 'bg-white text-orange-600 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
            <button
              onClick={() => setSortBy('top')}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                sortBy === 'top' ? 'bg-white text-orange-600 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Top</span>
            </button>
          </div>
        </div>

        {/* Channel Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          {forumChannels.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setSelectedChannel(ch.id)}
              className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors ${
                selectedChannel === ch.id
                  ? 'bg-stone-900 text-white font-bold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {ch.label}
            </button>
          ))}
        </div>
      </div>

      {/* Forum Discussions List */}
      <div className="space-y-3">
        {filteredForums.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-stone-500 text-xs">
            No discussions found in this channel. Be the first to start a thread!
          </div>
        ) : (
          filteredForums.map((post) => {
            const isCommentsOpen = expandedComments[post.id];
            return (
              <div
                key={post.id}
                className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 flex gap-4 hover:shadow-xs transition-shadow"
              >
                {/* Upvote / Downvote column */}
                <div className="flex flex-col items-center justify-start bg-stone-50 p-1.5 rounded-lg border border-stone-200 shrink-0">
                  <button
                    onClick={() => handleVoteForum(post.id, 1)}
                    className={`p-1 rounded-sm transition-colors ${
                      post.userVote === 1
                        ? 'text-orange-600 bg-orange-100'
                        : 'text-stone-400 hover:text-orange-600'
                    }`}
                  >
                    <ArrowBigUp className="w-6 h-6 fill-current" />
                  </button>
                  <span
                    className={`text-xs font-black my-0.5 ${
                      post.userVote === 1
                        ? 'text-orange-600'
                        : post.userVote === -1
                        ? 'text-blue-600'
                        : 'text-stone-700'
                    }`}
                  >
                    {post.upvotes}
                  </span>
                  <button
                    onClick={() => handleVoteForum(post.id, -1)}
                    className={`p-1 rounded-sm transition-colors ${
                      post.userVote === -1
                        ? 'text-blue-600 bg-blue-100'
                        : 'text-stone-400 hover:text-blue-600'
                    }`}
                  >
                    <ArrowBigDown className="w-6 h-6 fill-current" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap text-[11px] text-stone-500">
                    <span className="font-bold text-orange-800 bg-orange-50 px-2 py-0.5 rounded-sm">
                      {post.channel}
                    </span>
                    <span>•</span>
                    <span>Posted by u/{post.author}</span>
                    {post.petBadge && (
                      <span className="bg-amber-50 text-amber-800 font-semibold px-1.5 py-0.5 rounded-sm">
                        {post.petBadge}
                      </span>
                    )}
                    <span>•</span>
                    <span>{post.timestamp}</span>
                  </div>

                  <h3 className="text-sm font-bold text-stone-900">{post.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>

                  <div className="flex items-center gap-3 pt-2 text-xs text-stone-500">
                    <button
                      onClick={() =>
                        setExpandedComments((prev) => ({
                          ...prev,
                          [post.id]: !prev[post.id],
                        }))
                      }
                      className="flex items-center gap-1.5 hover:text-stone-900 font-medium"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.commentsCount + (post.comments?.length || 0)} comments</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-stone-900 font-medium">
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </button>
                  </div>

                  {/* Expandable comments section */}
                  {isCommentsOpen && (
                    <div className="mt-3 pt-3 border-t border-stone-100 space-y-3">
                      {/* Comments list */}
                      {post.comments && post.comments.length > 0 && (
                        <div className="space-y-2">
                          {post.comments.map((comment) => (
                            <div
                              key={comment.id}
                              className="text-xs bg-stone-50 p-2.5 rounded-lg border border-stone-200/60"
                            >
                              <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                                <span className="font-bold text-stone-800">{comment.author}</span>
                                <span>{comment.timestamp}</span>
                              </div>
                              <p className="text-stone-700">{comment.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply input */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={commentInputs[post.id] || ''}
                          onChange={(e) =>
                            setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddForumComment(post.id);
                          }}
                          className="flex-1 text-xs border border-stone-200 rounded-lg px-3 py-1.5 outline-hidden focus:ring-1 focus:ring-orange-500"
                        />
                        <button
                          onClick={() => handleAddForumComment(post.id)}
                          className="p-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Start Discussion Modal */}
      {isForumModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-stone-200">
            <button
              onClick={() => setIsForumModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleSubmitNewForum} className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-orange-600">Preddit Discussion</span>
                <h3 className="text-sm font-bold text-stone-900">Start a Thread</h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Select Channel</label>
                <select
                  value={newChannel}
                  onChange={(e) => setNewChannel(e.target.value)}
                  className="w-full text-xs p-2 border border-stone-300 rounded-lg outline-hidden bg-white"
                >
                  <option value="p/DogTraining">p/DogTraining</option>
                  <option value="p/VetQuestions">p/VetQuestions</option>
                  <option value="p/PetStories">p/PetStories</option>
                  <option value="p/AdoptionSuccess">p/AdoptionSuccess</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Discussion Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Best recall training tips for energetic puppies?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs p-2 border border-stone-300 rounded-lg outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Content / Question</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share your experience or ask the community for advice..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full text-xs p-2 border border-stone-300 rounded-lg outline-hidden"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsForumModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-xs"
                >
                  Post Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
