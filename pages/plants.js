import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button } from 'react-bootstrap';
import Link from 'next/link';
import axios from 'axios';
import Navigation from '../components/Navigation';
import { API_BASE_URL } from '../lib/config';

export default function Plants() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      console.log('Пытаюсь загрузить растения...');
      const response = await axios.get(`${API_BASE_URL}/api/plants`);
      console.log('Данные получены:', response.data);
      setPlants(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Ошибка загрузки:', err);
      setError(`Ошибка при загрузке растений: ${err.message}`);
      setLoading(false);
    }
  };

  // Временно: заглушка с тестовыми данными
  const useTestData = () => {
    setPlants([
      {
        id: 1,
        name: "Тестовый томат",
        species: "Томат Черри", 
        plantingDate: "2024-01-15",
        description: "Тестовое растение"
      },
      {
        id: 2, 
        name: "Тестовый базилик",
        species: "Базилик",
        plantingDate: "2024-01-20",
        description: "Еще одно тестовое растение"
      }
    ]);
    setLoading(false);
    setError('');
  };

  if (loading) return (
    <>
      <Navigation />
      <Container className="mt-4">
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Загрузка растений...</span>
          </div>
          <p className="mt-2">Загрузка растений...</p>
        </div>
      </Container>
    </>
  );

  return (
    <>
      <Navigation />
      <Container className="mt-4">
        {error && (
          <Alert variant="danger">
            <h5>Ошибка загрузки</h5>
            <p>{error}</p>
            <p>Возможные причины:</p>
            <ul>
              <li>Сервер бэкенда не запущен</li>
              <li>Сервер работает на другом порту</li>
              <li>Проблемы с CORS</li>
            </ul>
            <div className="d-flex gap-2">
              <Button variant="primary" onClick={fetchPlants}>
                Попробовать снова
              </Button>
              <Button variant="outline-secondary" onClick={useTestData}>
                Использовать тестовые данные
              </Button>
            </div>
          </Alert>
        )}
        
        <Row className="mb-4">
          <Col>
            <h2>Мои растения</h2>
            <p>Отслеживайте рост и уход за вашими растениями</p>
          </Col>
        </Row>
        
        {plants.length === 0 && !error ? (
          <Row>
            <Col className="text-center">
              <Card className="p-5">
                <h4>У вас пока нет растений</h4>
                <p>Добавьте первое растение для отслеживания</p>
                <Link href="/add-plant" className="btn btn-success">
                  Добавить растение
                </Link>
              </Card>
            </Col>
          </Row>
        ) : (
          <Row>
            {plants.map(plant => (
              <Col key={plant.id} md={6} lg={4} className="mb-4">
                <Card className="plant-card h-100">
                  <Card.Body>
                    <Card.Title>{plant.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {plant.species}
                    </Card.Subtitle>
                    <Card.Text>
                      Посажено: {new Date(plant.plantingDate).toLocaleDateString()}
                    </Card.Text>
                    {plant.description && (
                      <Card.Text className="text-muted small">
                        {plant.description}
                      </Card.Text>
                    )}
                  </Card.Body>
                  <Card.Footer>
                    <Link href={`/plants/${plant.id}`} className="btn btn-outline-success btn-sm">
                      Подробнее
                    </Link>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  );
}