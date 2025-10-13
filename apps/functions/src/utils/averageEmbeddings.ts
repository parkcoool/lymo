export default function averageEmbeddings(embeddings: number[][]): number[] {
  if (embeddings.length === 0) return [];
  const vectorLength = embeddings[0].length;
  const sumVector = new Array(vectorLength).fill(0);

  for (const embedding of embeddings) {
    for (let i = 0; i < vectorLength; i++) {
      sumVector[i] += embedding[i];
    }
  }
  return sumVector.map((val) => val / embeddings.length);
}
