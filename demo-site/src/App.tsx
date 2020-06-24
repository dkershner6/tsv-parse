import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Form, Table } from 'react-bootstrap';
import { parse, TSVLineResult } from 'tsv-parse';
import './bootstrap.css';

const App = () => {
    const [tsvValue, setTsvValue] = useState('');

    const parsedResult = useMemo(() => {
        if (tsvValue.length > 0) {
            return parse(tsvValue, { headerRow: true });
        }
        return null;
    }, [tsvValue]);

    const renderTable = () => {
        if (!parsedResult) {
            return null;
        }

        return (
            <Table>
                <thead>
                    <tr>
                        {parsedResult.fieldNames.map((fieldName) => (
                            <th>{fieldName}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {parsedResult.lines.map((line) => renderLine(line))}
                </tbody>
            </Table>
        );
    };

    const renderLine = (line: TSVLineResult) => {
        console.log(line);
        if (line.error) {
            return (
                <tr className="table-danger">
                    <td colSpan={parsedResult.fieldNames.length}>
                        {line.errorMessage}
                    </td>
                </tr>
            );
        }
        return (
            <tr className="table-success">
                {Object.values(line.parsedLine).map((value) => (
                    <td>{value}</td>
                ))}
            </tr>
        );
    };

    return (
        <Container>
            <header>
                <h1 className="display-2">TSV Parser</h1>
            </header>
            <main>
                <Row className="mt-5">
                    <Col>
                        <Form.Group controlId="tsvToParse">
                            <Form.Label>
                                Paste from your favorite spreadsheet program
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={10}
                                value={tsvValue}
                                onChange={(event) =>
                                    setTsvValue(event.target.value)
                                }
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col>{renderTable()}</Col>
                </Row>
            </main>
        </Container>
    );
};

export default App;
