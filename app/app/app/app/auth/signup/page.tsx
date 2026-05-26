"use client"; import { FormEvent, useState } from "react"; import { supabase } from "@/lib/supabaseClient"; import Link from "next/link";

export default function SignUp() { const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [msg, setMsg] = useState<string | null>(null);

async function onSubmit(e: FormEvent) { e.preventDefault(); const { error } = await supabase.auth.signUp({ email, password }); setMsg(error ? error.message : "Check your email to confirm your account."); }

return (

Create your CoCreate account
<input className="w-full px-3 py-2 rounded bg-white/10" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} /> <input className="w-full px-3 py-2 rounded bg-white/10" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} /> Sign up {msg &&
{msg}

}
Already have an account? Log in

); }
Create new file: app/auth/login/page.tsx Paste:
"use client"; import { FormEvent, useState } from "react"; import { supabase } from "@/lib/supabaseClient"; import Link from "next/link"; import { useRouter } from "next/navigation";

export default function Login() { const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [msg, setMsg] = useState<string | null>(null); const router = useRouter();

async function onSubmit(e: FormEvent) { e.preventDefault(); const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) setMsg(error.message); else router.push("/profile"); }

return (
  Welcome back
<input className="w-full px-3 py-2 rounded bg-white/10" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} /> <input className="w-full px-3 py-2 rounded bg-white/10" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} /> Log in {msg &&
{msg}

}
No account? Sign up

); }
Create new file: app/profile/page.tsx Paste:
"use client"; import { useEffect, useState } from "react"; import { supabase } from "@/lib/supabaseClient";

type Profile = { display_name: string; bio: string | null; location: string | null; categories: string[] | null; };

export default function ProfilePage() { const [profile, setProfile] = useState({ display_name: "", bio: "", location: "", categories: [] }); const [msg, setMsg] = useState<string | null>(null);

useEffect(() => { (async () => { const { data: { user } } = await supabase.auth.getUser(); if (!user) return; const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(); if (data) setProfile({ display_name: data.display_name, bio: data.bio, location: data.location, categories: data.categories ?? [] }); })(); }, []);

async function save() { const { data: { user } } = await supabase.auth.getUser(); if (!user) { setMsg("Please log in."); return; } const upsert = { user_id: user.id, ...profile, updated_at: new Date().toISOString() }; const { error } = await supabase.from("profiles").upsert(upsert); setMsg(error ? error.message : "Profile saved"); }

return (
  Your profile
<input className="w-full px-3 py-2 rounded bg-white/10" placeholder="Display name" value={profile.display_name} onChange={(e)=>setProfile(p=>({...p, display_name: e.target.value}))} /> <textarea className="w-full px-3 py-2 rounded bg-white/10" placeholder="Bio" value={profile.bio ?? ""} onChange={(e)=>setProfile(p=>({...p, bio: e.target.value}))} /> <input className="w-full px-3 py-2 rounded bg-white/10" placeholder="Location" value={profile.location ?? ""} onChange={(e)=>setProfile(p=>({...p, location: e.target.value}))} /> <input className="w-full px-3 py-2 rounded bg-white/10" placeholder="Categories (comma separated)" value={(profile.categories ?? []).join(", ")} onChange={(e)=>setProfile(p=>({...p, categories: e.target.value.split(",").map(s=>s.trim()).filter(Boolean)}))} /> Save {msg &&
{msg}

}
); }
