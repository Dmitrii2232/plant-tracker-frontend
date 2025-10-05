import Head from 'next/head';
import Facts from '../components/Facts';
import Navigation from '../components/Navigation';

export default function FactsPage() {
  return (
    <>
      <Head>
        <title>Советы и факты - Трекер Растений</title>
      </Head>
      <Navigation />
      <Facts />
    </>
  );
}