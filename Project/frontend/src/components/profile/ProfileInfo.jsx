import React, { useEffect, useRef, useState } from "react";
import { api, getAuth, saveAuth } from "../../utils/api";

export default function ProfileInfo({
  name = "User",
  userId,
  avatar,
  onAvatarChanged,
  isOwner = false,
  onEdit,
}) {
  const { user: me } = getAuth();
  const [rel, setRel] = useState("none"); 
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    const loadRelation = async () => {
      if (!me?._id || !userId) return setRel("none");
      if (String(me._id) === String(userId)) return setRel("self");
      try {
        const r = await api.get(`/api/users/${userId}/relation?me=${me._id}`);
        setRel(r.status || "none");
      } catch {
        setRel("none");
      }
    };
    loadRelation();
  }, [userId, me?._id]);

  const pickFile = () => fileRef.current?.click();

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/^image\//.test(file.type)) return alert("Select an image");
    if (file.size > 2 * 1024 * 1024) return alert("Max 2MB");

    const toB64 = (f) =>
      new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result);
        r.onerror = rej;
        r.readAsDataURL(f);
      });

    setBusy(true);
    try {
      const b64 = await toB64(file);
      const updated = await api.put(`/api/users/${userId}`, { avatar: b64 });
      if (me && String(me._id) === String(userId)) {
        const { token } = getAuth();
        saveAuth({ user: { ...me, avatar: updated.avatar || b64 }, token });
      }
      onAvatarChanged?.(updated.avatar || b64);
    } catch (err) {
      alert(err.message || "Failed to update photo");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  const sendRequest = async () => {
    if (!me?._id) return;
    setBusy(true);
    try {
      await api.post(`/api/users/${userId}/friends/request?from=${me._id}`);
      setRel("outgoing");
    } finally {
      setBusy(false);
    }
  };

  const unfriend = async () => {
    if (!me?._id) return;
    setBusy(true);
    try {
      await api.delete(`/api/users/${me._id}/friends/${userId}`);
      setRel("none");
    } finally {
      setBusy(false);
    }
  };

  const renderAction = () => {
    if (isOwner) {
      return (
        <div className="flex gap-2">
          <button onClick={onEdit} className="px-4 py-2 border rounded bg-white hover:bg-gray-100">
            Edit Profile
          </button>
        </div>
      );
    }
    if (rel === "friends")
      return <button onClick={unfriend} className="px-4 py-2 border rounded">Unfriend</button>;
    if (rel === "outgoing")
      return <button disabled className="px-4 py-2 border rounded opacity-70">Pending</button>;
    if (rel === "incoming")
      return <span className="text-sm text-gray-600">Friend request received</span>;
    return (
      <button onClick={sendRequest} className="px-4 py-2 bg-brand-orange text-white rounded">
        Add Friend
      </button>
    );
  };

  return (
    <section aria-labelledby="profile-title">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden">
            {avatar && avatar.trim() !== "" ? (
              <img src={avatar} alt={`${name}'s avatar`} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-500">
                {String(name || "U").charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Small camera icon overlay — owner only */}
          {isOwner && (
            <>
              <button
                type="button"
                onClick={pickFile}
                disabled={busy}
                title="Change photo"
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border shadow
                           flex items-center justify-center hover:bg-gray-50"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-700" fill="currentColor">
                  <path d="M9 2 7.17 4H5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3h-2.17L15 2H9zm3 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 .002 6.002A3 3 0 0 0 12 9z" />
                </svg>
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
            </>
          )}
        </div>

        <div className="flex-1">
          <h2 id="profile-title" className="text-xl font-bold">{name}</h2>
          <div className="mt-2">{renderAction()}</div>
        </div>
      </div>
    </section>
  );
}
