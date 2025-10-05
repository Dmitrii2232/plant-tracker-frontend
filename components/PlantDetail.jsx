import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Card, Button, Form, Alert, Tab, Tabs, Badge } from 'react-bootstrap';
import axios from 'axios';
import { API_BASE_URL } from '../lib/config';
import GrowthChart from './GrowthChart';

function PlantDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  const [plant, setPlant] = useState(null);
  const [growthRecords, setGrowthRecords] = useState([]);
  const [careTasks, setCareTasks] = useState([]);
  const [newRecord, setNewRecord] = useState({
    height: '',
    leafCount: '',
    notes: '',
    imageUrl: ''
  });
  const [newTask, setNewTask] = useState({
    taskType: 'полив',
    description: '',
    dueDate: '',
    priority: 2
  });
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id && id !== 'undefined') {
      console.log('🔄 Загружаем данные для растения ID:', id);
      fetchPlantData();
      fetchGrowthRecords();
      fetchCareTasks();
    }
  }, [id]);

  const fetchPlantData = async () => {
    try {
      const plantId = parseInt(id);
      
      if (isNaN(plantId)) {
        throw new Error(`Некорректный ID растения: ${id}`);
      }
      
      console.log('📡 Запрос к API для растения ID:', plantId);
      const response = await axios.get(`${API_BASE_URL}/api/plants/${plantId}`);
      setPlant(response.data);
      setLoading(false);
    } catch (err) {
      console.error('❌ Ошибка при загрузке данных растения:', err);
      setError(`Ошибка при загрузке растения: ${err.response?.data || err.message}`);
      setLoading(false);
    }
  };

  const fetchGrowthRecords = async () => {
    try {
      const plantId = parseInt(id);
      if (!isNaN(plantId)) {
        const response = await axios.get(`${API_BASE_URL}/api/plants/${plantId}/growth-records`);
        setGrowthRecords(response.data);
      }
    } catch (err) {
      console.error('Ошибка при загрузке записей о росте:', err);
    }
  };

  const fetchCareTasks = async () => {
    try {
      const plantId = parseInt(id);
      if (!isNaN(plantId)) {
        const response = await axios.get(`${API_BASE_URL}/api/plants/${plantId}/tasks`);
        setCareTasks(response.data);
      }
    } catch (err) {
      console.error('Ошибка при загрузке задач:', err);
    }
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    try {
      const plantId = parseInt(id);
      const recordData = {
        ...newRecord,
        height: parseFloat(newRecord.height),
        leafCount: newRecord.leafCount ? parseInt(newRecord.leafCount) : null,
        recordDate: new Date().toISOString()
      };
      
      await axios.post(`${API_BASE_URL}/api/plants/${plantId}/growth-records`, recordData);
      setNewRecord({ height: '', leafCount: '', notes: '', imageUrl: '' });
      fetchGrowthRecords();
    } catch (err) {
      setError('Ошибка при добавлении записи');
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const plantId = parseInt(id);
      await axios.post(`${API_BASE_URL}/api/plants/${plantId}/tasks`, newTask);
      setNewTask({ taskType: 'полив', description: '', dueDate: '', priority: 2 });
      fetchCareTasks();
    } catch (err) {
      setError('Ошибка при создании задачи');
    }
  };

  const handleTaskStatusChange = async (taskId, completed) => {
    try {
      const plantId = parseInt(id);
      await axios.put(`${API_BASE_URL}/api/plants/${plantId}/tasks/${taskId}/status`, {
        completed: completed
      });
      fetchCareTasks();
    } catch (err) {
      console.error('Ошибка при обновлении статуса задачи');
    }
  };

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 1: return 'danger';
      case 2: return 'warning';
      case 3: return 'info';
      default: return 'secondary';
    }
  };

  const getTaskTypeIcon = (type) => {
    const icons = {
      'полив': '💧',
      'удобрение': '🌱',
      'обрезка': '✂️',
      'пересадка': '🔄',
      'другое': '📝'
    };
    return icons[type] || '📝';
  };

  if (loading) return (
    <Container className="mt-4">
      <div className="text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
        <p className="mt-2">Загружаем данные растения...</p>
      </div>
    </Container>
  );

  if (error) return (
    <Container className="mt-4">
      <Alert variant="danger">
        <h5>Ошибка загрузки</h5>
        <p>{error}</p>
        <div className="d-flex gap-2">
          <Button variant="primary" onClick={fetchPlantData}>
            Попробовать снова
          </Button>
          <Button variant="outline-secondary" onClick={() => router.push('/plants')}>
            Вернуться к списку растений
          </Button>
        </div>
      </Alert>
    </Container>
  );

  if (!plant) return (
    <Container className="mt-4">
      <Alert variant="warning">
        <h5>Растение не найдено</h5>
        <p>Растение с ID {id} не существует или было удалено.</p>
        <Button variant="primary" onClick={() => router.push('/plants')}>
          Вернуться к списку растений
        </Button>
      </Alert>
    </Container>
  );

  const pendingTasks = careTasks.filter(task => !task.completed);
  const completedTasks = careTasks.filter(task => task.completed);

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>{plant.name}</h2>
              <p className="text-muted mb-0">{plant.species}</p>
              <small className="text-muted">
                Посажено: {new Date(plant.plantingDate).toLocaleDateString('ru-RU')}
              </small>
            </div>
            <Badge bg="success" className="fs-6">
              {growthRecords.length > 0 ? `${growthRecords[0].height} см` : 'Нет данных'}
            </Badge>
          </div>
          {plant.description && (
            <p className="mt-2">{plant.description}</p>
          )}
        </Col>
      </Row>

      <Tabs activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)} className="mb-4">
        <Tab eventKey="info" title="📊 Информация">
          <Row>
            <Col lg={8}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Добавить запись о росте</h5>
                </Card.Header>
                <Card.Body>
                  <Form onSubmit={handleAddRecord}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Высота (см) *</Form.Label>
                          <Form.Control
                            type="number"
                            step="0.1"
                            value={newRecord.height}
                            onChange={(e) => setNewRecord({...newRecord, height: e.target.value})}
                            required
                            placeholder="Введите высоту растения"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Количество листьев</Form.Label>
                          <Form.Control
                            type="number"
                            value={newRecord.leafCount}
                            onChange={(e) => setNewRecord({...newRecord, leafCount: e.target.value})}
                            placeholder="Опционально"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Заметки</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={newRecord.notes}
                        onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                        placeholder="Любые наблюдения, изменения, проблемы..."
                      />
                    </Form.Group>
                    
                    <div className="d-flex gap-2">
                      <Button type="submit" variant="success">
                        💾 Сохранить запись
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline-secondary"
                        onClick={() => setNewRecord({ height: '', leafCount: '', notes: '', imageUrl: '' })}
                      >
                        Очистить
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <Card>
                <Card.Header>
                  <h6 className="mb-0">📈 Статистика</h6>
                </Card.Header>
                <Card.Body>
                  {growthRecords.length > 0 ? (
                    <div>
                      <p><strong>Текущая высота:</strong> {growthRecords[0].height} см</p>
                      {growthRecords[0].leafCount && (
                        <p><strong>Листьев:</strong> {growthRecords[0].leafCount}</p>
                      )}
                      <p><strong>Всего записей:</strong> {growthRecords.length}</p>
                      {growthRecords.length > 1 && (
                        <p><strong>Общий рост:</strong> 
                          +{(growthRecords[0].height - growthRecords[growthRecords.length - 1].height).toFixed(1)} см
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted">Нет данных о росте</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="growth" title="📈 График роста">
          <Row>
            <Col>
              <GrowthChart growthRecords={growthRecords} />
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="tasks" title="✅ Задачи по уходу">
          <Row>
            <Col lg={8}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Активные задачи</h5>
                </Card.Header>
                <Card.Body>
                  {pendingTasks.length > 0 ? (
                    pendingTasks.map(task => (
                      <Card key={task.id} className="mb-3">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="d-flex align-items-center">
                              <Form.Check
                                type="checkbox"
                                checked={task.completed}
                                onChange={(e) => handleTaskStatusChange(task.id, e.target.checked)}
                                className="me-3"
                              />
                              <div>
                                <h6 className="mb-1">
                                  {getTaskTypeIcon(task.taskType)} {task.taskType}
                                </h6>
                                <p className="mb-1">{task.description}</p>
                                <small className="text-muted">
                                  Срок: {new Date(task.dueDate).toLocaleDateString('ru-RU')}
                                </small>
                              </div>
                            </div>
                            <Badge bg={getPriorityVariant(task.priority)}>
                              Приоритет: {task.priority}
                            </Badge>
                          </div>
                        </Card.Body>
                      </Card>
                    ))
                  ) : (
                    <p className="text-muted">Нет активных задач</p>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <Card>
                <Card.Header>
                  <h6 className="mb-0">Добавить задачу</h6>
                </Card.Header>
                <Card.Body>
                  <Form onSubmit={handleAddTask}>
                    <Form.Group className="mb-3">
                      <Form.Label>Тип задачи</Form.Label>
                      <Form.Select
                        value={newTask.taskType}
                        onChange={(e) => setNewTask({...newTask, taskType: e.target.value})}
                      >
                        <option value="полив">💧 Полив</option>
                        <option value="удобрение">🌱 Удобрение</option>
                        <option value="обрезка">✂️ Обрезка</option>
                        <option value="пересадка">🔄 Пересадка</option>
                        <option value="другое">📝 Другое</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Описание *</Form.Label>
                      <Form.Control
                        type="text"
                        value={newTask.description}
                        onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                        placeholder="Что нужно сделать?"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Срок выполнения *</Form.Label>
                      <Form.Control
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Приоритет</Form.Label>
                      <Form.Select
                        value={newTask.priority}
                        onChange={(e) => setNewTask({...newTask, priority: parseInt(e.target.value)})}
                      >
                        <option value={1}>🔴 Высокий</option>
                        <option value={2}>🟡 Средний</option>
                        <option value={3}>🔵 Низкий</option>
                      </Form.Select>
                    </Form.Group>

                    <Button type="submit" variant="success" className="w-100">
                      ➕ Добавить задачу
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>
    </Container>
  );
}

export default PlantDetail;