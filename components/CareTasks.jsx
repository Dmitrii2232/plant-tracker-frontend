import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, Button, Form, Badge, Alert, Row, Col, ListGroup } from 'react-bootstrap';
import axios from 'axios';

function CareTasks() {
  const router = useRouter();
  const { id } = router.query;
  
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    taskType: 'полив',
    description: '',
    dueDate: '',
    priority: 2
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (id && id !== 'undefined') {
      fetchTasks();
    }
  }, [id]);

  const fetchTasks = async () => {
    try {
      const plantId = parseInt(id);
      if (!isNaN(plantId)) {
        const response = await axios.get(`http://localhost:8080/api/plants/${plantId}/tasks`);
        setTasks(response.data);
        setLoading(false);
      }
    } catch (err) {
      console.error('Ошибка при загрузке задач:', err);
      setError('Не удалось загрузить задачи');
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const plantId = parseInt(id);
      if (!isNaN(plantId)) {
        await axios.post(`http://localhost:8080/api/plants/${plantId}/tasks`, newTask);
        setNewTask({ taskType: 'полив', description: '', dueDate: '', priority: 2 });
        setSuccess('Задача успешно добавлена!');
        fetchTasks();
        
        // Автоматически скрываем сообщение об успехе через 3 секунды
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Ошибка при создании задачи:', err);
      setError('Ошибка при создании задачи. Проверьте подключение к серверу.');
    }
  };

  const handleStatusChange = async (taskId, completed) => {
    try {
      const plantId = parseInt(id);
      if (!isNaN(plantId)) {
        await axios.put(`http://localhost:8080/api/plants/${plantId}/tasks/${taskId}/status`, {
          completed: completed
        });
        fetchTasks();
        
        if (completed) {
          setSuccess('Задача отмечена как выполненная!');
          setTimeout(() => setSuccess(''), 2000);
        }
      }
    } catch (err) {
      console.error('Ошибка при обновлении статуса:', err);
      setError('Ошибка при обновлении статуса задачи');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
      try {
        const plantId = parseInt(id);
        if (!isNaN(plantId)) {
          await axios.delete(`http://localhost:8080/api/plants/${plantId}/tasks/${taskId}`);
          setSuccess('Задача удалена!');
          fetchTasks();
          setTimeout(() => setSuccess(''), 2000);
        }
      } catch (err) {
        console.error('Ошибка при удалении задачи:', err);
        setError('Ошибка при удалении задачи');
      }
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

  const getPriorityText = (priority) => {
    switch (priority) {
      case 1: return 'Высокий';
      case 2: return 'Средний';
      case 3: return 'Низкий';
      default: return 'Не указан';
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

  const getTaskTypeText = (type) => {
    const texts = {
      'полив': 'Полив',
      'удобрение': 'Удобрение',
      'обрезка': 'Обрезка',
      'пересадка': 'Пересадка',
      'другое': 'Другое'
    };
    return texts[type] || type;
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Фильтруем задачи
  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  // Сортируем pending задачи по приоритету и дате
  const sortedPendingTasks = [...pendingTasks].sort((a, b) => {
    // Сначала по приоритету (высокий приоритет первый)
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    // Затем по дате выполнения (ближайшие даты первые)
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
        <p className="mt-2">Загружаем задачи...</p>
      </div>
    );
  }

  return (
    <Row>
      <Col lg={8}>
        {/* Сообщения */}
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        {/* Активные задачи */}
        <Card className="mb-4">
          <Card.Header className="bg-warning bg-opacity-10">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">📋 Активные задачи</h5>
              <Badge bg="warning" className="fs-6">
                {pendingTasks.length}
              </Badge>
            </div>
          </Card.Header>
          <Card.Body>
            {sortedPendingTasks.length > 0 ? (
              <ListGroup variant="flush">
                {sortedPendingTasks.map(task => (
                  <ListGroup.Item key={task.id} className="px-0">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="d-flex align-items-start flex-grow-1">
                        <Form.Check
                          type="checkbox"
                          checked={task.completed}
                          onChange={(e) => handleStatusChange(task.id, e.target.checked)}
                          className="me-3 mt-1"
                        />
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center mb-1">
                            <span className="fs-5 me-2">
                              {getTaskTypeIcon(task.taskType)}
                            </span>
                            <div>
                              <h6 className="mb-0">
                                {getTaskTypeText(task.taskType)}
                              </h6>
                              <p className="mb-1 text-dark">{task.description}</p>
                            </div>
                          </div>
                          
                          <div className="d-flex flex-wrap gap-3">
                            <small className={`fw-medium ${
                              isOverdue(task.dueDate) ? 'text-danger' : 'text-muted'
                            }`}>
                              📅 {formatDate(task.dueDate)}
                              {isOverdue(task.dueDate) && ' 🔴 Просрочено'}
                            </small>
                            
                            <Badge bg={getPriorityVariant(task.priority)} className="me-2">
                              {getPriorityText(task.priority)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                        title="Удалить задачу"
                      >
                        🗑️
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <div className="text-center py-4">
                <div className="text-muted mb-3" style={{ fontSize: '3rem' }}>✅</div>
                <h6 className="text-muted">Нет активных задач</h6>
                <p className="text-muted mb-0">Все задачи выполнены!</p>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Выполненные задачи */}
        {completedTasks.length > 0 && (
          <Card>
            <Card.Header className="bg-success bg-opacity-10">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">✅ Выполненные задачи</h6>
                <Badge bg="success" className="fs-6">
                  {completedTasks.length}
                </Badge>
              </div>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {completedTasks.map(task => (
                  <ListGroup.Item key={task.id} className="px-0">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="d-flex align-items-start flex-grow-1">
                        <Form.Check
                          type="checkbox"
                          checked={true}
                          onChange={(e) => handleStatusChange(task.id, false)}
                          className="me-3 mt-1"
                        />
                        <div className="flex-grow-1">
                          <div className="text-decoration-line-through text-muted">
                            <div className="d-flex align-items-center mb-1">
                              <span className="fs-5 me-2">
                                {getTaskTypeIcon(task.taskType)}
                              </span>
                              <div>
                                <h6 className="mb-0">
                                  {getTaskTypeText(task.taskType)}
                                </h6>
                                <p className="mb-1">{task.description}</p>
                              </div>
                            </div>
                            <small>
                              📅 {formatDate(task.dueDate)} • 
                              <Badge bg="secondary" className="ms-2">
                                {getPriorityText(task.priority)}
                              </Badge>
                            </small>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                        title="Удалить задачу"
                      >
                        🗑️
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        )}
      </Col>

      <Col lg={4}>
        {/* Форма добавления новой задачи */}
        <Card className="sticky-top" style={{ top: '20px' }}>
          <Card.Header className="bg-success text-white">
            <h6 className="mb-0">➕ Новая задача</h6>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleCreateTask}>
              <Form.Group className="mb-3">
                <Form.Label>Тип задачи *</Form.Label>
                <Form.Select
                  value={newTask.taskType}
                  onChange={(e) => setNewTask({...newTask, taskType: e.target.value})}
                  required
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
                  as="textarea"
                  rows={3}
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Опишите, что нужно сделать..."
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
                  min={new Date().toISOString().split('T')[0]}
                />
                <Form.Text className="text-muted">
                  Выберите дату, к которой нужно выполнить задачу
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Приоритет</Form.Label>
                <Form.Select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: parseInt(e.target.value)})}
                >
                  <option value={1}>🔴 Высокий</option>
                  <option value={2}>🟡 Средний</option>
                  <option value={3}>🔵 Низкий</option>
                </Form.Select>
                <Form.Text className="text-muted">
                  Высокий приоритет отображается первым
                </Form.Text>
              </Form.Group>

              <Button 
                type="submit" 
                variant="success" 
                className="w-100"
                size="lg"
              >
                📌 Добавить задачу
              </Button>
            </Form>
          </Card.Body>
        </Card>

        {/* Статистика */}
        <Card className="mt-3">
          <Card.Header>
            <h6 className="mb-0">📊 Статистика задач</h6>
          </Card.Header>
          <Card.Body>
            <div className="d-flex justify-content-between mb-2">
              <span>Всего задач:</span>
              <Badge bg="primary">{tasks.length}</Badge>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Активные:</span>
              <Badge bg="warning">{pendingTasks.length}</Badge>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Выполненные:</span>
              <Badge bg="success">{completedTasks.length}</Badge>
            </div>
            <div className="d-flex justify-content-between">
              <span>Просроченные:</span>
              <Badge bg="danger">
                {pendingTasks.filter(task => isOverdue(task.dueDate)).length}
              </Badge>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default CareTasks;