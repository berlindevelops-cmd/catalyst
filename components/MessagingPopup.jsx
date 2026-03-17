"use client";
import { useEffect, useState, useRef } from "react";
import { getSupabase } from "@/lib/supabase";

export default function MessagingPopup({ userId }) {
  const [open, setOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeConvo, setActiveConvo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const channelRef = useRef(null);

  // load conversations — accepted applications with active jobs
  useEffect(() => {
    if (!userId) return;
    loadConversations();

    const channel = getSupabase()
      .channel("conversations")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        () => {
          loadConversations();
        }
      )
      .subscribe();

    return () => getSupabase().removeChannel(channel);
  }, [userId]);

  async function loadConversations() {
    const { data } = await getSupabase()
      .from("applications")
      .select(`
        id,
        teen_id,
        employer_id,
        status,
        jobs ( id, title, status ),
        profiles!teen_id (
          full_name
        ),
        employer:profiles!employer_id (
          full_name,
          business_name
        )
      `)
      .eq("status", "accepted")
      .or(`teen_id.eq.${userId},employer_id.eq.${userId}`)
      .filter("jobs.status", "eq", "active");

    // filter out any where job was deleted/closed
    const active = (data ?? []).filter((c) => c.jobs !== null);
    setConversations(active);

    // count unread — messages not from current user in last load
    const appIds = active.map((c) => c.id);
    if (appIds.length > 0) {
      const { data: unread } = await getSupabase()
        .from("messages")
        .select("id")
        .in("application_id", appIds)
        .neq("sender_id", userId);
      setUnreadCount(unread?.length ?? 0);
    }
  }

  // load messages for active conversation
  useEffect(() => {
    if (!activeConvo) return;

    loadMessages(activeConvo.id);

    // clear previous channel
    if (channelRef.current) {
      getSupabase().removeChannel(channelRef.current);
    }

    // real-time messages
    const channel = getSupabase()
      .channel(`messages-${activeConvo.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `application_id=eq.${activeConvo.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
          scrollToBottom();
        }
      )
      .subscribe();

    channelRef.current = channel;
    return () => getSupabase().removeChannel(channel);
  }, [activeConvo]);

  async function loadMessages(applicationId) {
    const { data } = await getSupabase()
      .from("messages")
      .select("*")
      .eq("application_id", applicationId)
      .order("created_at", { ascending: true });
    setMessages(data ?? []);
    setTimeout(scrollToBottom, 100);
  }

  async function sendMessage() {
    if (!newMessage.trim() || !activeConvo) return;
    const content = newMessage.trim();
    setNewMessage("");
    await getSupabase().from("messages").insert({
      application_id: activeConvo.id,
      sender_id: userId,
      content,
    });
    scrollToBottom();
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function getConvoName(convo) {
    if (convo.teen_id === userId) {
      // current user is teen — show employer name
      return convo.employer?.business_name ?? convo.employer?.full_name ?? "Employer";
    } else {
      // current user is employer — show teen name
      return convo.profiles?.full_name ?? "Teen";
    }
  }

  return (
    <>
      {/* floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 right-5 md:bottom-6 md:right-6 z-50 w-14 h-14 bg-black text-[#C8FF00] rounded-full shadow-lg flex items-center justify-center hover:bg-gray-900 transition"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
        )}
        {unreadCount > 0 && !open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* popup */}
      {open && (
        <div className="fixed bottom-36 right-5 md:bottom-24 md:right-6 z-50 w-[340px] md:w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          style={{ height: "480px" }}
        >
          {/* header */}
          <div className="bg-black px-4 py-3 flex items-center justify-between shrink-0">
            {activeConvo ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setActiveConvo(null); setMessages([]); }}
                  className="text-[#C8FF00] hover:text-white transition"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M19 12H5M12 5l-7 7 7 7"/>
                  </svg>
                </button>
                <div>
                  <p className="text-white text-sm font-semibold">{getConvoName(activeConvo)}</p>
                  <p className="text-gray-400 text-xs">{activeConvo.jobs?.title}</p>
                </div>
              </div>
            ) : (
              <p className="text-white font-semibold text-sm">Messages</p>
            )}
            <div className="w-2 h-2 rounded-full bg-[#C8FF00] animate-pulse" />
          </div>

          {/* inbox list */}
          {!activeConvo && (
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
                  <span className="text-4xl">💬</span>
                  <p className="text-sm font-medium text-gray-700">No messages yet</p>
                  <p className="text-xs text-gray-400">
                    Messages unlock when an application is accepted
                  </p>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-gray-100">
                  {conversations.map((convo) => (
                    <button
                      key={convo.id}
                      onClick={() => setActiveConvo(convo)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-black text-[#C8FF00] flex items-center justify-center text-sm font-bold shrink-0">
                        {getConvoName(convo)[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {getConvoName(convo)}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {convo.jobs?.title}
                        </p>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* chat view */}
          {activeConvo && (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
                    <span className="text-3xl">👋</span>
                    <p className="text-xs text-gray-400">No messages yet — say hello!</p>
                  </div>
                )}
                {messages.map((msg) => {
                  const isMe = msg.sender_id === userId;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                          isMe
                            ? "bg-black text-[#C8FF00] rounded-br-sm"
                            : "bg-gray-100 text-gray-900 rounded-bl-sm"
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p className={`text-xs mt-1 ${isMe ? "text-gray-400" : "text-gray-400"}`}>
                          {new Date(msg.created_at).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* input */}
              <div className="px-3 py-3 border-t border-gray-100 flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  placeholder="Message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 text-sm outline-none focus:border-black transition"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="w-9 h-9 rounded-full bg-black text-[#C8FF00] flex items-center justify-center hover:bg-gray-900 transition disabled:opacity-30 shrink-0"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}