import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

const Finished = () => {
  return (
    <Card
      style={{ width: "50%" }}
      border="success"
      className="mx-auto my-5 fs-5 text-center"
    >
      <Card.Body>
        <Card.Title>The audio files were successfully uploaded.</Card.Title>
        <Card.Text>Thank you for participating in the task!</Card.Text>
        <Button href="/tasks" variant="success">
          Back to Tasks
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Finished;
