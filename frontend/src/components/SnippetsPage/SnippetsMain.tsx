/**
 * components/SnippetsPage/SnippetsMain.tsx
 *
 * Main component for the SnippetsPage, responsible for displaying snippets as cards or accordion items
 */
import { SnippetsContext } from "@context/SnippetsContext";
import type { Snippet, DisplayOptionsState } from "@models";
import { useContext } from "react";
import { Accordion, Button, Card, Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function MainCards({ snippets }: { snippets: Snippet[] }) {
  return (
    <main>
      <Row>
        {snippets.map((snippet) => {
          return <SnippetCard key={snippet.id} snippet={snippet} />;
        })}
      </Row>
    </main>
  );
}
function MainListing({ snippets }: { snippets: Snippet[] }) {
  return (
    <main>
      <Accordion>
        {snippets.map((snippet) => {
          return <SnippetListing key={snippet.id} snippet={snippet} />;
        })}
      </Accordion>
    </main>
  );
}

function SnippetCard({ snippet }: { snippet: Snippet }) {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(`/snippet/${snippet.title}`);
  };
  return (
    <Col xs={12} className="mb-3">
      <Card>
        <Card.Body>
          <Card.Title>
            {snippet.title} -- {snippet.language} <br />
            <Link to={`/user/${snippet.owner.username}`}>
              {snippet.owner.username}
            </Link>
          </Card.Title>
          <Card.Text>{snippet.description}</Card.Text>
        </Card.Body>
        <Card.Footer>
          <Button variant="success" onClick={handleNavigate}>
            More Details
          </Button>
        </Card.Footer>
      </Card>
    </Col>
  );
}

function SnippetListing({ snippet }: { snippet: Snippet }) {
  const navigate = useNavigate();
  const navigateToDetails = () => {
    navigate(`/snippet/${snippet.title}`);
  };
  return (
    <Accordion.Item eventKey={snippet.id.toString()}>
      <Accordion.Header>
        {snippet.title} -- {snippet.language} --&ensp;
        <Link to={`/user/${snippet.owner.username}`}>
          {snippet.owner.username}
        </Link>
      </Accordion.Header>
      <Accordion.Body>
        {snippet.description}
        <br />
        <Button variant="success" onClick={navigateToDetails}>
          More Details
        </Button>
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

type SortConfigTypes = keyof typeof SORT_CONFIG;

function applyDisplayState(
  snippets: Snippet[],
  displayState: DisplayOptionsState,
) {
  // We need the snippets to load before doing any operations on them
  const config = SORT_CONFIG[displayState.sortOption as SortConfigTypes];
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
      // Am I really going to be creating new Date objects from each date???
      // It says it can't do functions otherwise...
      // I'll look into it later, but it seems like a waste
      if (config.key === "creation") {
        const aCreation = new Date(a.creation_date).getTime();
        const bCreation = new Date(b.creation_date).getTime();
        return (aCreation - bCreation) * config.dir;
      } else if (config.key === "update") {
        const aLastUpdated = new Date(a.last_updated_date).getTime();
        const bLastUpdated = new Date(b.last_updated_date).getTime();
        return (aLastUpdated - bLastUpdated) * config.dir;
      } else {
        return (
          new Date(a.creation_date).getTime() -
          new Date(b.creation_date).getTime()
        );
      }
    });
  }
  return data;
}

function SnippetsMain({ displayState }: { displayState: DisplayOptionsState }) {
  const snippetsContext = useContext(SnippetsContext);
  if (!snippetsContext) {
    throw new Error("[SnippetsMain.tsx] - Failed to get context");
  }
  const snippets = snippetsContext.snippets;
  const snippetsLoading = snippetsContext.snippetsLoading;
  if (snippetsLoading) {
    return <h1>LOADING SNIPPETS</h1>;
  }
  const displaySnippets = applyDisplayState(snippets, displayState);

  return (
    <>
      {displayState.displayOption === "grid" && (
        <MainCards snippets={displaySnippets} />
      )}
      {displayState.displayOption === "list" && (
        <MainListing snippets={displaySnippets} />
      )}
    </>
  );
}
export default SnippetsMain;
