import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { API_BASE_URL } from '../lib/config';

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/suppliers`);
      setSuppliers(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Ошибка при загрузке поставщиков');
      setLoading(false);
    }
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    !filter || 
    supplier.name.toLowerCase().includes(filter.toLowerCase()) ||
    supplier.plantTypes.toLowerCase().includes(filter.toLowerCase()) ||
    supplier.description.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>Где купить семена</h2>
          <p>Проверенные поставщики семян и саженцев</p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Form.Group>
            <Form.Label>Поиск поставщиков</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введите название растения, поставщика..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <Form.Text className="text-muted">
              Например: "томаты", "розы", "овощные" и т.д.
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center">Загрузка...</div>
      ) : (
        <Row>
          {filteredSuppliers.length === 0 ? (
            <Col>
              <Alert variant="info">
                Поставщики не найдены. Попробуйте изменить параметры поиска.
              </Alert>
            </Col>
          ) : (
            filteredSuppliers.map(supplier => (
              <Col key={supplier.id} lg={6} className="mb-4">
                <Card className="h-100">
                  <Card.Body>
                    <Card.Title>{supplier.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Специализация: {supplier.plantTypes}
                    </Card.Subtitle>
                    <Card.Text>{supplier.description}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    {supplier.website ? (
                      <a 
                        href={supplier.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-success btn-sm"
                      >
                        Перейти на сайт
                      </a>
                    ) : (
                      <span className="text-muted">Сайт не указан</span>
                    )}
                  </Card.Footer>
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}

      <Row className="mt-4">
        <Col>
          <Card className="bg-light">
            <Card.Body>
              <Card.Title>Советы по выбору семян</Card.Title>
              <ul>
                <li>Проверяйте срок годности семян</li>
                <li>Обращайте внимание на производителя</li>
                <li>Читайте отзывы других садоводов</li>
                <li>Выбирайте сорта, подходящие для вашего региона</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Suppliers;