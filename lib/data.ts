import { getSupabaseClient } from './supabase';
import type { BrandSlug } from './brands';

/** Busca (ou cria, se ainda não existir) o registro da marca na tabela brands e retorna o id */
export async function getBrandId(slug: BrandSlug): Promise<string> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from('brands').select('id').eq('slug', slug).single();
  if (error || !data) {
    throw new Error(
      `Marca "${slug}" não encontrada no Supabase. Rode o script sql/schema.sql (ele já insere as duas marcas).`
    );
  }
  return data.id;
}

export async function listRecords<T = any>(
  table: string,
  brandId: string,
  opts?: { orderBy?: string; ascending?: boolean }
): Promise<T[]> {
  const supabase = getSupabaseClient();
  let query = supabase.from(table).select('*').eq('brand_id', brandId);
  if (opts?.orderBy) query = query.order(opts.orderBy, { ascending: opts.ascending ?? true });
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as T[];
}

export async function createRecord<T = any>(table: string, payload: Record<string, any>): Promise<T> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from(table).insert(payload as any).select().single();
  if (error) throw error;
  return data as T;
}

export async function updateRecord<T = any>(table: string, id: string, payload: Record<string, any>): Promise<T> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from(table).update(payload as any).eq('id', id).select().single();
  if (error) throw error;
  return data as T;
}

export async function deleteRecord(table: string, id: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
}
