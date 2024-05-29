import { Container, Row, Metric, Button, AddButton, TextArea, RemoveButton } from './style';

interface MetricProps {
    metrics: string[];
    addMetric: () => void;
    removeMetric: (index: number) => void;
    editMetric: (index: number, newMetric: string) => void;
}

const Metrics: React.FC<MetricProps> = ({ metrics, addMetric, removeMetric, editMetric }) => {
    const half = Math.ceil(metrics.length / 2);
    return(
        <Container>
            <Row>
                {metrics.slice(0, half).map((metric, index) => (
                    <Metric key={index}>
                        <TextArea
                        value={metric}
                        onChange={(e) => editMetric(index, e.target.value)}
                        />
                        <RemoveButton onClick={() => removeMetric(index + half)}>✕</RemoveButton>
                    </Metric>
                ))}
            </Row>
            <Row>
                {metrics.slice(half).map((metric, index) => (
                    <Metric key={index + half}>
                        <TextArea
                        value={metric}
                        onChange={(e) => editMetric(index, e.target.value)}
                        />
                        <RemoveButton onClick={() => removeMetric(index + half)}>✕</RemoveButton>
                    </Metric>
                ))}
            </Row>
        <AddButton onClick={addMetric}>Add Metric</AddButton>
        </Container>
    );
}

export default Metrics;