import PartyClient from './PartyClient';
import './party.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;


type PartyPageProps = {
  params: Promise<{
    partyId: string;
  }>;
};

export default async function PartyPage({ params }: PartyPageProps) {
  const { partyId } = await params;

  const res = await fetch(
    `${API_URL}/parties/${partyId}/songs`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    console.error("Failed to fetch songs", await res.text());
    return <PartyClient partyId={partyId} initialSongs={[]} />;
  }

  const songs = await res.json();

  return (
    <div className='party-container'>
      <PartyClient partyId={partyId} initialSongs={songs} />
    </div>
  );
}
