/**
 * SnippetsMain.tsx
 *
 * Main component for the SnippetsPage, responsible for displaying snippets as cards or accordion items
 */
import { SnippetsContext } from "@context/SnippetsContext";
import type { Snippet, DisplayOptionsState } from "@models";
import { useContext } from "react";
import { Accordion, Button, Card } from "react-bootstrap";

function MainCards({ data }: { data: Snippet[] }) {
  return (
    <main>
      {data.map((snippet) => {
        return <SnippetCard key={snippet.id} snippet={snippet} />;
      })}
    </main>
  );
}
function MainListing({ data }: { data: Snippet[] }) {
  return (
    <main>
      <Accordion>
        {data.map((snippet) => {
          return <SnippetListing key={snippet.id} snippet={snippet} />;
        })}
      </Accordion>
    </main>
  );
}

function SnippetCard({ snippet }: { snippet: Snippet }) {
  return (
    <Card>
      <Card.Body>
        <Card.Title>{snippet.title}</Card.Title>
        <Card.Text>{snippet.description}</Card.Text>
      </Card.Body>
      <Card.Footer>
        <Button variant="success">More Details</Button>
      </Card.Footer>
    </Card>
  );
}

function SnippetListing({ snippet }: { snippet: Snippet }) {
  return (
    <Accordion.Item eventKey={snippet.id.toString()}>
      <Accordion.Header>{snippet.title}</Accordion.Header>
      <Accordion.Body>
        {snippet.description}
        <br />
        <Button variant="success">More Details</Button>
      </Accordion.Body>
    </Accordion.Item>
  );
}

const SORT_CONFIG = {
  Newest: { key: "creation", dir: -1 },
  Oldest: { key: "creation", dir: 1 },
  "Most Recently Updated": { key: "update", dir: -1 },
  "Least Recently Updated": { key: "update", dir: 1 },
};

function SnippetsMain({ displayState }: { displayState: DisplayOptionsState }) {
  console.log(displayState);
  const context = useContext(SnippetsContext);
  if (!context) {
    throw new Error("[SnippetsMain.tsx] - Failed to get context");
  }
  const snippets = context.snippets;

  const config =
    SORT_CONFIG[displayState.sortOption as keyof typeof SORT_CONFIG];
  const data = snippets
    .filter((snippet) => {
      if (displayState.searchFilter === "") {
        return snippet;
      }
      return snippet.title
        .toLowerCase()
        .includes(displayState.searchFilter.toLowerCase());
    })
    .filter((snippet) => {
      if (displayState.languageFilter === "All") {
        return snippet;
      }
      return snippet.language === displayState.languageFilter;
    });
  if (config) {
    data.sort((a, b) => {
      if (config.key === "Newest" || config.key === "Oldest") {
        const aCreation = a.creationDate.getTime();
        const bCreation = b.creationDate.getTime();
        return (aCreation - bCreation) * config.dir;
      } else if (
        config.key === "Most Recently Updated" ||
        config.key === "Least Recently Updated"
      ) {
        const aLastUpdated = a.lastUpdatedDate.getTime();
        const bLastUpdated = b.lastUpdatedDate.getTime();
        return (aLastUpdated - bLastUpdated) * config.dir;
      } else {
        // Default here
        console.error("[SnippetsMain.tsx] - Failed to sort");
        return a.creationDate.getTime() - b.creationDate.getTime();
      }
    });
  }
  return (
    <>
      <h1>Snippets Page</h1>
      <MainCards data={data} />
      <MainListing data={data} />
    </>
  );
}
export default SnippetsMain;
