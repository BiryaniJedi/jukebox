import PartySongs from './PartySongs';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

type PartyPageProps = {
  params: {
    partyId: string;
  }
}
export default async function PartyPage({ params }: PartyPageProps ) {
    const { partyId } = params;

    const songs = await fetch(
      `${API_URL}/parties/${partyId}/songs`,
      { cache: "no-store" }
    ).then(r => r.json());
    
    return <PartySongs partyId={partyId} initialSongs={songs} />;
}