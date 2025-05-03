"use client"; // 👉 Next.js 13+ me client-side interactivity ke liye zaruri hai

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// ✅ Ye hamare dummy posts hain - jaise community users ne post kiya ho
const posts = [
  {
    id: 1,
    author: "sameera Khan",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    content: "Excited for this weekend’s community meetup! 🎉",
    image: "https://plus.unsplash.com/premium_photo-1706061121025-4ea17e4d9d9a?q=80&w=1632&auto=format",
    comments: ["That sounds awesome!", "Can’t wait to join!"],
    likes: 12,
  },
  {
    id: 2,
    author: "Rahul Verma",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    content: "Just shared a resource on sustainable tech!",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&auto=format",
    comments: ["Thanks for sharing!", "Very helpful."],
    likes: 7,
  },
];

// ✅ Ye function time ago dikhata hai (like "5 min ago")
const timeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export default function Home() {
  // ✅ post comments, likes, and open state yahan store ki gayi hai
  const [commentData, setCommentData] = useState(() =>
    posts.reduce((acc, post) => {
      acc[post.id] = {
        open: false,
        liked: false,
        likes: post.likes,
        comments: post.comments.map((text) => ({
          text,
          timestamp: new Date(),
          avatar: post.avatar,
        })),
        input: "", // user ka input comment yahan store hota hai
      };
      return acc;
    }, {} as Record<
      number,
      {
        open: boolean;
        liked: boolean;
        likes: number;
        comments: { text: string; timestamp: Date; avatar: string }[];
        input: string;
      }
    >)
  );

  // ✅ comments box open/close karne ke liye
  const toggleComments = (id: number) => {
    setCommentData((prev) => ({
      ...prev,
      [id]: { ...prev[id], open: !prev[id].open },
    }));
  };

  // ✅ user input handle
  const handleInput = (id: number, value: string) => {
    setCommentData((prev) => ({
      ...prev,
      [id]: { ...prev[id], input: value },
    }));
  };

  // ✅ comment add karne ka logic
  const addComment = (id: number) => {
    const input = commentData[id].input.trim();
    if (!input) return;

    const newComment = {
      text: input,
      timestamp: new Date(),
      avatar: "https://randomuser.me/api/portraits/men/3.jpg", // dummy avatar
    };

    setCommentData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        open: true,
        input: "",
        comments: [...prev[id].comments, newComment],
      },
    }));
  };

  // ✅ like/unlike toggle
  const toggleLike = (id: number) => {
    setCommentData((prev) => {
      const post = prev[id];
      return {
        ...prev,
        [id]: {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
        },
      };
    });
  };

  // ✅ upcoming events list
  const events = [
    { id: 1, title: "Community Meetup", date: "Oct 15", time: "10:00 AM" },
    { id: 2, title: "Tech Workshop", date: "Oct 20", time: "2:00 PM" },
    { id: 3, title: "Volunteer Drive", date: "Oct 25", time: "9:00 AM" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 text-gray-900 p-6 md:p-10">
      {/* ✅ Top heading */}
      <header className="text-center mb-10">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-800">📚 Community Hub</h1>
        <p className="text-gray-600 mt-3 text-lg">Join, share & connect with like-minded people</p>
      </header>

      {/* ✅ Main section: Left = Posts, Right = Events */}
      <section className="grid md:grid-cols-3 gap-10">
        {/* ✅ Posts Section */}
        <div className="md:col-span-2 space-y-8">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl shadow-md p-6 space-y-4"
            >
              {/* ✅ Author Info */}
              <div className="flex items-center gap-4">
                <Image src={post.avatar} alt="avatar" width={50} height={50} className="rounded-full object-cover" />
                <div>
                  <h2 className="text-lg font-semibold">{post.author}</h2>
                  <p className="text-xs text-gray-400">Community Member</p>
                </div>
              </div>

              {/* ✅ Content & Image */}
              <p>{post.content}</p>
              <Image src={post.image} alt="post image" width={800} height={400} className="rounded-xl h-64 w-full object-cover" />

              {/* ✅ Like & Comment Buttons */}
              <div className="flex justify-between text-sm text-gray-500 mt-2 pt-2 border-t">
                <button onClick={() => toggleComments(post.id)}>💬 {commentData[post.id].comments.length} Comments</button>
                <button onClick={() => toggleLike(post.id)}>
                  {commentData[post.id].liked ? "💖" : "💜"} {commentData[post.id].likes} Likes
                </button>
              </div>

              {/* ✅ Comments Section */}
              <AnimatePresence>
                {commentData[post.id].open && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 mt-4"
                  >
                    {/* ✅ Comments List */}
                    {commentData[post.id].comments.map((comment, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-gray-100 rounded-xl px-4 py-2 text-sm">
                        <Image src={comment.avatar} alt="avatar" width={28} height={28} className="rounded-full object-cover" />
                        <div>
                          <p>{comment.text}</p>
                          <p className="text-xs text-gray-400">{timeAgo(comment.timestamp)}</p>
                        </div>
                      </div>
                    ))}

                    {/* ✅ Comment Input */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={commentData[post.id].input}
                        onChange={(e) => handleInput(post.id, e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 px-3 py-2 border rounded-lg text-sm"
                      />
                      <button
                        onClick={() => addComment(post.id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        Post
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* ✅ Events Section */}
        <aside className="bg-white rounded-3xl shadow-md p-6 space-y-5">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-3">📅 Upcoming Events</h3>
          {events.map((event) => (
            <div key={event.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-700">{event.title}</p>
                  <p className="text-sm text-gray-500">{event.date} • {event.time}</p>
                </div>
                <button className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-1.5 rounded-lg transition">
                  Join
                </button>
              </div>
            </div>
          ))}
        </aside>
      </section>
    </main>
  );
}
