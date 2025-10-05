import Head from 'next/head';
import Suppliers from '../components/Suppliers';
import Navigation from '../components/Navigation';

export default function SuppliersPage() {
  return (
    <>
      <Head>
        <title>Где купить семена - Трекер Растений</title>
      </Head>
      <Navigation />
      <Suppliers />
    </>
  );
}