'use client';

import { Petition } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  fetchPetitionScoreById,
  fetchUserVote,
  postPetitionVote,
  deleteUserVote,
} from '@/app/petitions/actions';

type Props = {
  petitions?: Petition[];
};

type VoteState = 'up' | 'down' | null;

const PetitionCard = ({ petition }: { petition: Petition }) => {
  const [voteState, setVoteState] = useState<VoteState>(null);
  const [petitionScore, setPetitionScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadScore = async () => {
      const scoreData = await fetchPetitionScoreById(petition.id);
      setPetitionScore(scoreData?.score ?? 0);
    };
    const loadVoteState = async () => {
      const vote = await fetchUserVote(petition.id);
      if (!vote) return;
      if (vote.vote === 1) setVoteState('up');
      else setVoteState('down');
    };
    loadScore();
    loadVoteState();
  }, [petition.id]);

  const handleUpvote = async (petitionId: string) => {
    if (isLoading) return;

    const wasUp = voteState === 'up';
    const previousVoteState = voteState;
    setVoteState(wasUp ? null : 'up');

    setIsLoading(true);
    try {
      if (wasUp) {
        // User klickt nochmal auf upvote -> Vote löschen
        await deleteUserVote(petitionId);
      } else {
        // User wechselt Vote oder votet zum ersten Mal
        await postPetitionVote(petitionId, 1);
      }
      const scoreData = await fetchPetitionScoreById(petitionId);
      setPetitionScore(scoreData?.score ?? 0);
    } catch (error) {
      console.error('Error voting:', error);
      setVoteState(previousVoteState);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownvote = async (petitionId: string) => {
    if (isLoading) return;

    const wasDown = voteState === 'down';
    const previousVoteState = voteState;
    setVoteState(wasDown ? null : 'down');

    setIsLoading(true);
    try {
      if (wasDown) {
        // User klickt nochmal auf downvote -> Vote löschen
        await deleteUserVote(petitionId);
      } else {
        // User wechselt Vote oder votet zum ersten Mal
        await postPetitionVote(petitionId, -1);
      }
      const scoreData = await fetchPetitionScoreById(petitionId);
      setPetitionScore(scoreData?.score ?? 0);
    } catch (error) {
      console.error('Error voting:', error);
      setVoteState(previousVoteState);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={cn('h-full hover:shadow-md transition-shadow my-4')}>
      <CardHeader className="pb-2 pt-6">
        <div className="flex flex-col items-start gap-1.5">
          <CardTitle className="text-lg font-semibold leading-none tracking-tight">
            {petition.title}
          </CardTitle>

          <CardDescription className="text-xs">
            {new Date(petition.created_at).toLocaleDateString('de-DE', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground line-clamp-1">{petition.description}</p>
      </CardContent>
      <CardFooter className="flex">
        <div className="flex border rounded-full overflow-hidden">
          <button
            onClick={() => handleUpvote(petition.id)}
            disabled={isLoading}
            className={cn(
              'flex items-center gap-2 px-3 py-2 border-r border-border transition-colors hover:cursor-pointer disabled:opacity-50',
              voteState === 'up' && 'bg-green-500 text-white'
            )}
          >
            <ArrowBigUp className={cn(voteState === 'up' && 'fill-current')} />
            <span>{petitionScore}</span>
          </button>
          <button
            onClick={() => handleDownvote(petition.id)}
            disabled={isLoading}
            className={cn(
              'flex items-center px-3 py-2 transition-colors hover:cursor-pointer disabled:opacity-50',
              voteState === 'down' && 'bg-red-500 text-white'
            )}
          >
            <ArrowBigDown className={cn(voteState === 'down' && 'fill-current')} />
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};

const PetitionsList = ({ petitions }: Props) => {
  if (!petitions || petitions.length === 0) {
    return <div className="text-center text-muted-foreground py-8">Keine Petitionen gefunden.</div>;
  }
  return (
    <div>
      {petitions.map((petition) => (
        <PetitionCard key={petition.id} petition={petition} />
      ))}
    </div>
  );
};

export default PetitionsList;
