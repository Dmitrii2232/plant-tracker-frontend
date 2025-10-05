import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { API_BASE_URL } from '../lib/config';

function Facts() {
  const [facts, setFacts] = useState([]);
  const [randomFact, setRandomFact] = useState(null);
  const [filter, setFilter] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFacts();
    fetchRandomFact();
  }, []);

  const fetchFacts = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/facts`);
      setFacts(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Ошибка при загрузке фактов:', err);
      setError('Не удалось загрузить факты');
      setLoading(false);
    }
  };

  const fetchRandomFact = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/facts/random`);
      setRandomFact(response.data);
    } catch (err) {
      console.error('Ошибка при загрузке случайного факта:', err);
    }
  };

  const filteredFacts = facts.filter(fact => {
    const matchesFilter = !filter || 
      fact.plantType.toLowerCase().includes(filter.toLowerCase()) ||
      fact.fact.toLowerCase().includes(filter.toLowerCase());
    const matchesCategory = !category || fact.category === category;
    return matchesFilter && matchesCategory;
  });

  const categories = [...new Set(facts.map(fact => fact.category))];

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>Советы и факты о растениях</h2>
          <p>Полезная информация для успешного выращивания</p>
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {randomFact && (
        <Row className="mb-4">
          <Col>
            <Card className="border-warning">
              <Card.Body>
                <Card.Title>🌿 Факт дня</Card.Title>
                <Card.Text className="mb-1">
                  <strong>{randomFact.plantType}</strong>
                </Card.Text>
                <Card.Text>{randomFact.fact}</Card.Text>
                <Button variant="outline-warning" size="sm" onClick={fetchRandomFact}>
                  Другой факт
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Поиск по растениям и фактам</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введите название растения или ключевое слово..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Категория</Form.Label>
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Все категории</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center">Загрузка...</div>
      ) : (
        <Row>
          {filteredFacts.length === 0 ? (
            <Col>
              <Alert variant="info">
                Факты не найдены. Попробуйте изменить параметры поиска.
              </Alert>
            </Col>
          ) : (
            filteredFacts.map(fact => (
              <Col key={fact.id} md={6} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Title className="text-success">
                      {fact.plantType}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted small">
                      {fact.category}
                    </Card.Subtitle>
                    <Card.Text>{fact.fact}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}
    </Container>
  );
}

export default Facts;