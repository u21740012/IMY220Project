import React, { useEffect, useState } from "react";
import { api, getAuth } from "../../utils/api";

export default function FriendsPanel({ userId, isOwner }) {
  const { user: me } = getAuth();
  const [data, setData] = useState({ friends: [], incoming: [], outgoing: [] });

  const load = async () => {
    try {
      const res = await api.get(`/api/users/${userId}/friends`);
      setData(res || { friends: [], incoming: [], outgoing: [] });
    } catch {
      setData({ friends: [], incoming: [], outgoing: [] });
    }
  };

  useEffect(() => { if (userId) load(); }, [userId]);

  const unfriend = async (targetId) => {
    if (!isOwner || !me?._id) return;
    await api.delete(`/api/users/${me._id}/friends/${targetId}`);
    load();
  };
  const accept = async (fromId) => {
    if (!isOwner || !me?._id) return;
    await api.post(`/api/users/${me._id}/friends/accept?from=${fromId}&me=${me._id}`);
    load();
  };
  const reject = async (fromId) => {
    if (!isOwner || !me?._id) return;
    await api.post(`/api/users/${me._id}/friends/reject?from=${fromId}&me=${me._id}`);
    load();
  };

  return (
    <section aria-labelledby="friends-title" className="bg-white border rounded-md p-4">
      <h3 id="friends-title" className="text-base font-semibold text-black mb-2">Friends</h3>

      {isOwner && data.incoming.length > 0 && (
        <>
          <h4 className="text-sm font-semibold mb-2">Requests</h4>
          <ul className="space-y-2 mb-4">
            {data.incoming.map((u) => (
              <li key={u._id} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <img src={u.avatar || ""} alt="" className="w-6 h-6 rounded-full bg-gray-200 object-cover" />
                  <span className="text-sm">{u.username}</span>
                </span>
                <span className="flex gap-2">
                  <button onClick={() => accept(u._id)} className="px-2 py-1 border rounded text-xs">Accept</button>
                  <button onClick={() => reject(u._id)} className="px-2 py-1 border rounded text-xs">Reject</button>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}

      <h4 className="text-sm font-semibold mb-2">All</h4>
      <ul className="space-y-2">
        {data.friends.map((u) => (
          <li key={u._id} className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <img src={u.avatar || ""} alt="" className="w-6 h-6 rounded-full bg-gray-200 object-cover" />
              <span className="text-sm">{u.username}</span>
            </span>
            {isOwner && (
              <button onClick={() => unfriend(u._id)} className="px-2 py-1 border rounded text-xs">
                Unfriend
              </button>
            )}
          </li>
        ))}
        {data.friends.length === 0 && <li className="text-sm text-gray-500">—</li>}
      </ul>

      {isOwner && data.outgoing.length > 0 && (
        <>
          <div className="h-px bg-gray-200 my-3" />
          <h4 className="text-sm font-semibold mb-2">Pending (you sent)</h4>
          <ul className="space-y-2">
            {data.outgoing.map((u) => (
              <li key={u._id} className="flex items-center gap-2 text-sm">
                <img src={u.avatar || ""} alt="" className="w-6 h-6 rounded-full bg-gray-200 object-cover" />
                <span>{u.username}</span>
                <span className="ml-auto text-xs text-gray-500">Pending</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
