import { Link, useLoaderData, useParams } from "@remix-run/react";

import type { LoaderArgs } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { json } from "@remix-run/node";

export const loader = async ({ params }: LoaderArgs) => {
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) {
    throw new Error("Joke not found");
  }
  return json({ joke });
};

export default function JokeRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{data.joke.content}</p>
      <Link to=".">"{data.joke.name}" Permalink</Link>
    </div>
  );
}

export function ErrorBoundary() {
  const { jokeId } = useParams();
  return (
    <div className="error-container">
      There was an error loading joke by the id "${jokeId}". Sorry.
    </div>
  );
}
