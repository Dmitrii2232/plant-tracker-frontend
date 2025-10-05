import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useRouter } from 'next/router';
import axios from 'axios';
import { API_BASE_URL } from '../lib/config';

function AddPlant() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    plantingDate: new Date().toISOString().split('T')[0],
    description: '',
    imageUrl: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('📡 Отправка данных на:', `${API_BASE_URL}/api/plants`);
      await axios.post(`${API_BASE_URL}/api/plants`, formData);
      setSuccess('Растение успешно добавлено!');
      
      setTimeout(() => {
        router.push('/plants');
      }, 2000);
      
    } catch (err) {
      console.error('❌ Ошибка при добавлении растения:', err);
      setError('Ошибка при добавлении растения. Проверьте подключение к серверу.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Header className="bg-success text-white">
              <h4 className="mb-0">🌿 Добавить новое растение</h4>
            </Card.Header>
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger">
                  <strong>Ошибка:</strong> {error}
                </Alert>
              )}
              
              {success && (
                <Alert variant="success">
                  <strong>Успех!</strong> {success}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Название растения *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Помидорчик, Базилик..."
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Вид растения *</Form.Label>
                      <Form.Control
                        type="text"
                        name="species"
                        value={formData.species}
                        onChange={handleChange}
                        required
                        placeholder="Томат, Базилик, Роза..."
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Дата посадки *</Form.Label>
                  <Form.Control
                    type="date"
                    name="plantingDate"
                    value={formData.plantingDate}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Описание</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Расскажите о вашем растении..."
                    disabled={loading}
                  />
                  <Form.Text className="text-muted">
                    Необязательное поле
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>URL изображения</Form.Label>
                  <Form.Control
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/plant-photo.jpg"
                    disabled={loading}
                  />
                  <Form.Text className="text-muted">
                    Необязательное поле
                  </Form.Text>
                </Form.Group>
                
                <div className="d-flex gap-3">
                  <Button 
                    type="submit" 
                    variant="success" 
                    size="lg" 
                    className="flex-fill"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Добавляем...
                      </>
                    ) : (
                      '✅ Добавить растение'
                    )}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline-secondary" 
                    size="lg"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Отмена
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AddPlant;