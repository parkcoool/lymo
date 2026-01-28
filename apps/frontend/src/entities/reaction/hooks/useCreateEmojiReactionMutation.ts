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
        let newData: Bucket[] = [];
        let newCounts: Partial<Record<ReactionEmoji, number>> = {};

        const index = Math.floor(timestampInSeconds / 5);

        if (oldData && oldData[index]) {
          newCounts = { ...oldData[index].counts };
          newCounts[emoji] = (newCounts[emoji] ?? 0) + 1;

          const newBucket: Bucket = { ...oldData[index], counts: newCounts };
          newData = [...oldData];
          newData[index] = newBucket;
        } else {
          newCounts[emoji] = 1;
          const newBucket: Bucket = {
            start: index * 5,
            end: index * 5 + 5,
            counts: newCounts,
          };
          newData[index] = newBucket;
        }

        return newData;
      });
    },
  });
}
