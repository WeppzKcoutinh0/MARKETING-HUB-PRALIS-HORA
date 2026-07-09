import Dashboard from '@/components/Dashboard';
import { getBrand } from '@/lib/brands';

export default function BrandDashboardPage({ params }: { params: { brand: 'pralis' | 'hora' } }) {
  const brand = getBrand(params.brand);
  return <Dashboard brand={brand} />;
}
