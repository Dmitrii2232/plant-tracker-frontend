import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import PlantDetail from '../../components/PlantDetail';
import Navigation from '../../components/Navigation';

export default function PlantDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (router.isReady && id && id !== 'undefined') {
      console.log('✅ ID загружен:', id);
      setIsReady(true);
    }
  }, [router.isReady, id]);

  if (!isReady) {
    return (
      <>
        <Head>
          <title>Загрузка... - Трекер Растений</title>
        </Head>
        <Navigation />
        <div className="text-center mt-4">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
          <p className="mt-2">Загружаем страницу растения...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Детали растения - Трекер Растений</title>
      </Head>
      <Navigation />
      <PlantDetail />
    </>
  );
}