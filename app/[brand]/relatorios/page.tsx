import Reports from '@/components/Reports';
import { getBrand } from '@/lib/brands';

export default function ReportsPage({ params }: { params: { brand: 'pralis' | 'hora' } }) {
  const brand = getBrand(params.brand);
  return <Reports brand={brand} />;
}
