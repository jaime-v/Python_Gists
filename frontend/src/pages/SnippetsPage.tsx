/*
SnippetsPage.tsx

Page for displaying all snippets
*/
import type { Snippet } from "@models";
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

function SnippetsPage({ data }: { data: Snippet[] }) {
  return (
    <>
      <h1>Snippets Page</h1>
      <MainCards data={data} />
      <MainListing data={data} />
    </>
  );
}

export default SnippetsPage;
