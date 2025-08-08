import React, { useState, useEffect } from "react";
import {
  feedsCollection,
  usersCollection,
  db,
} from "./firebase.js";

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";

export default function FeedsTab() {
  const [recipients, setRecipients] = useState([]);
  const [feeds, setFeeds] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedEmails, setSelectedEmails] = useState([]);

  // Load recipients once on mount
  useEffect(() => {
    async function loadRecipients() {
      const snapshot = await getDocs(usersCollection);
      const emailsSet = new Set();
      const emails = [];
      snapshot.forEach(doc => {
        const email = doc.data().email;
        if (email && !emailsSet.has(email)) {
          emailsSet.add(email);
          emails.push(email);
        }
      });
      setRecipients(emails);
    }
    loadRecipients();
  }, []);

  // Listen to feeds live updates
  useEffect(() => {
    const q = query(feedsCollection, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const feedItems = [];
      snapshot.forEach(doc => {
        feedItems.push({ id: doc.id, ...doc.data() });
      });
      setFeeds(feedItems);
    });
    return () => unsubscribe();
  }, []);

  function toggleEmail(email) {
    setSelectedEmails(prev => 
      prev.includes(email)
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  }

  async function createFeed() {
    if (!title.trim() || !body.trim() || selectedEmails.length === 0) {
  // TODO: Handle validation error (removed alert)
      return;
    }
    await addDoc(feedsCollection, {
      title: title.trim(),
      body: body.trim(),
      assignedTo: selectedEmails,
      createdAt: new Date(),
      status: "pending",
    });
    setTitle("");
    setBody("");
    setSelectedEmails([]);
  }

  async function markDone(id) {
    await updateDoc(doc(feedsCollection, id), { status: "done" });
  }

  async function deleteFeed(id) {
    await deleteDoc(doc(feedsCollection, id));
  }

  return (
    <div>
      <section id="new-feed-form">
        <h2>Create new feed</h2>
        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Body"
          value={body}
          onChange={e => setBody(e.target.value)}
        />
        <div id="recipients-list">
          <h3>Select Recipients</h3>
          {recipients.map(email => (
            <label key={email} style={{ display: 'block', marginBottom: 6 }}>
              <input
                type="checkbox"
                checked={selectedEmails.includes(email)}
                onChange={() => toggleEmail(email)}
              /> {email}
            </label>
          ))}
        </div>
        <button onClick={createFeed}>Create Feed</button>
      </section>

      <section id="feeds-list" style={{ marginTop: 24 }}>
        <h2>Existing Feeds</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {feeds.map(feed => (
            <li
              key={feed.id}
              style={{
                background: "#1e0e32",
                padding: 16,
                marginBottom: 12,
                border: "1px solid #5b21b6",
                borderRadius: 8,
                boxShadow: "0 1px 4px rgba(147, 51, 234, 0.2)",
              }}
            >
              <strong>{feed.title}</strong>
              <span
                className={`status-label ${feed.status}`}
                style={{
                  marginLeft: 8,
                  padding: "2px 6px",
                  borderRadius: 4,
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  backgroundColor:
                    feed.status === "done" ? "#10b981" : "#facc15",
                  color: feed.status === "done" ? "#0c0a09" : "#3f0d42",
                }}
              >
                {feed.status}
              </span>
              <p style={{ marginTop: 8 }}>{feed.body}</p>
              <small>
                Assigned to: {feed.assignedTo?.join(", ") || "No one"}
              </small>
              <div className="feed-btns" style={{ marginTop: 10, display: "flex", gap: 10 }}>
                {feed.status !== "done" && (
                  <button onClick={() => markDone(feed.id)}>Mark as Done</button>
                )}
                <button onClick={() => deleteFeed(feed.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
