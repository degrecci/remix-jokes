import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useParams,
  useRouteError,
} from "@remix-run/react";

import type { LoaderArgs } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { json } from "@remix-run/node";

export const loader = async ({ params }: LoaderArgs) => {
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) {
    throw new Response("What a joke! Not found.", {
      status: 404,
    });
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
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="error-container">Huh? What the heck is "{jokeId}"?</div>
    );
  }

  return (
    <div className="error-container">
      There was an error loading joke by the id "${jokeId}". Sorry.
    </div>
  );
}
