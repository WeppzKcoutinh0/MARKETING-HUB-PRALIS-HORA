import DataModule from '@/components/DataModule';
import { getModule } from '@/lib/modules';

export default function Page({ params }: { params: { brand: 'pralis' | 'hora' } }) {
  return <DataModule brandSlug={params.brand} moduleConfig={getModule('calendario')} />;
}
