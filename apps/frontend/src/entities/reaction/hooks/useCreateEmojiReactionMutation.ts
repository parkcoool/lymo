import { Bucket } from "@lymo/schemas/doc";
import { ReactionEmoji } from "@lymo/schemas/shared";
import { useMutation } from "@tanstack/react-query";

import createEmojiReaction from "../apis/createEmojiReaction";

interface CreateEmojiReactionParams {
  storyId: string;
}

interface CreateEmojiReactionVariables {
  timestampInSeconds: number;
  emoji: ReactionEmoji;
}

export default function useCreateEmojiReactionMutation({ storyId }: CreateEmojiReactionParams) {
  return useMutation({
    mutationKey: ["create-emoji-reaction", storyId],

    mutationFn: async ({ timestampInSeconds, emoji }: CreateEmojiReactionVariables) => {
      return createEmojiReaction({
        storyId,
        timestampInSeconds,
        emoji,
      });
    },

    onMutate: ({ timestampInSeconds, emoji }, context) => {
      context.client.cancelQueries({
        queryKey: ["reaction-buckets", storyId],
      });

      context.client.setQueryData<Bucket[]>(["reaction-buckets", storyId], (oldData) => {
        if (!oldData) return oldData;

        const index = Math.floor(timestampInSeconds / 5);
        const bucket = oldData[index];
        if (!bucket) return oldData;

        const newCounts = { ...bucket.counts };
        newCounts[emoji] = (newCounts[emoji] ?? 0) + 1;

        const newBucket = { ...bucket, counts: newCounts };
        const newData = [...oldData];
        newData[index] = newBucket;

        return newData;
      });
    },
  });
}
