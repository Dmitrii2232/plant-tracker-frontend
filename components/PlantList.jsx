import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button, Spinner } from 'react-bootstrap';
import Link from 'next/link';
import axios from 'axios';
import { API_BASE_URL } from '../lib/config';

function PlantList() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      console.log('🔄 Загружаем растения с:', `${API_BASE_URL}/api/plants`);
      const response = await axios.get(`${API_BASE_URL}/api/plants`);
      console.log('✅ Данные получены:', response.data);
      setPlants(response.data);
      setLoading(false);
    } catch (err) {
      console.error('❌ Ошибка загрузки:', err);
      setError(`Ошибка при загрузке растений: ${err.message}`);
      setLoading(false);
    }
  };

  const useDemoData = () => {
    const demoPlants = [
      {
        id: 1,
        name: "Помидорчик",
        species: "Томат Черри",
        plantingDate: "2024-01-15",
        description: "Первый опыт выращивания томатов",
        imageUrl: ""
      },
      {
        id: 2,
        name: "Базилик душистый",
        species: "Базилик",
        plantingDate: "2024-01-20",
        description: "Выращиваю на кухонном подоконнике",
        imageUrl: ""
      }
    ];
    setPlants(demoPlants);
    setError('Используются демо-данные. Бэкенд недоступен.');
    setLoading(false);
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Spinner animation="border" variant="success" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </Spinner>
          <p className="mt-3">Загружаем ваши растения...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {error && (
        <Alert variant="warning" className="mb-4">
          <Alert.Heading>Внимание</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="d-flex gap-2">
            <Button variant="outline-primary" onClick={fetchPlants}>
              Попробовать снова
            </Button>
            <Button variant="outline-success" onClick={useDemoData}>
              Использовать демо-данные
            </Button>
          </div>
        </Alert>
      )}

      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>Мои растения {error && "(демо)"}</h2>
              <p className="text-muted mb-0">Отслеживайте рост и уход за вашими растениями</p>
            </div>
            <Link href="/add-plant" className="btn btn-success">
              ➕ Добавить растение
            </Link>
          </div>
        </Col>
      </Row>

      {plants.length === 0 && !error ? (
        <Row>
          <Col className="text-center">
            <Card className="p-5 border-dashed">
              <Card.Body>
                <div className="text-muted mb-3" style={{ fontSize: '4rem' }}>🌱</div>
                <h4>У вас пока нет растений</h4>
                <p className="text-muted mb-4">Добавьте первое растение для отслеживания</p>
                <Link href="/add-plant" className="btn btn-success btn-lg">
                  Добавить первое растение
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row>
          {plants.map(plant => (
            <Col key={plant.id} md={6} lg={4} className="mb-4">
              <Card className="plant-card h-100 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-success">{plant.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {plant.species}
                  </Card.Subtitle>
                  <Card.Text className="flex-grow-1">
                    <small className="text-muted">
                      📅 Посажено: {new Date(plant.plantingDate).toLocaleDateString('ru-RU')}
                    </small>
                  </Card.Text>
                  {plant.description && (
                    <Card.Text className="text-muted small">
                      {plant.description}
                    </Card.Text>
                  )}
                </Card.Body>
                <Card.Footer className="bg-transparent">
                  <Link 
                    href={`/plants/${plant.id}`} 
                    className="btn btn-outline-success btn-sm w-100"
                  >
                    👀 Подробнее
                  </Link>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default PlantList;