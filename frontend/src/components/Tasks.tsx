import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import { backendUrl } from "../config";

const Tasks = () => {
	const [taskIds, setTaskIds] = useState<string[] | null>(null);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchTasks = async () => {
			try {
				const response = await fetch(`${backendUrl}/tasks`);
				if (!response.ok) {
					throw new Error(`Error: ${response.statusText}`);
				}
				const tasks: string[] = await response.json();
				setTaskIds(tasks);
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError(String(err));
				}
			}
		};

		fetchTasks();
	}, []);

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (taskIds === null) {
		return <div>Loading...</div>;
	}

	return (
		<Container className="my-5 text-center">
			<h1>Available Tasks</h1>
			<h5>Select a task to start recording.</h5>

			<Card
				style={{ width: "70%" }}
				border="secondary"
				className="mx-auto my-5"
			>
				<Card.Header as="h5">Tasks</Card.Header>
				<Card.Body>
					{taskIds.length === 0 ? (
						<div className="fs-5">No tasks available.</div>
					) : (
						<div className="d-grid gap-3">
							{taskIds.map((taskId) => (
								<Button
									key={taskId}
									variant="outline-primary"
									className="fs-5 fw-bold"
									onClick={() => navigate(`/task/${taskId}`)}
								>
									{taskId}
								</Button>
							))}
						</div>
					)}
				</Card.Body>
			</Card>
		</Container>
	);
};

export default Tasks;

