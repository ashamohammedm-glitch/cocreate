import Link from "next/link";

export default function Home() { return (

CC
Discover. Match. CoCreate.
A creative network for creators to find collaborators across Instagram, TikTok, YouTube, X, and more.

Create your profile Explore creators
                                  <section className="grid md:grid-cols-3 gap-6">
    <Feature title="Find the right match" desc="Filter by platform, followers, niche, and location." />
    <Feature title="Pitch and collaborate" desc="Send requests with eligibility gates to reduce spam." />
    <Feature title="Grow together" desc="Track requests and feedback to build lasting collabs." />
  </section>
</main>
); }

function Feature({ title, desc }: { title: string; desc: string }) { return (

{title}
{desc}

); }
