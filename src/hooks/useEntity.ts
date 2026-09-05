/**
 * Medical360 Universal Entity Hooks
 * Consolidates data fetching, L1 RAM cache peeking, loading, and error states
 * for all entities into 2 polymorphic hooks instead of separate per-entity implementations.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { crudService, type EntityCollection, type EntityTypeMap } from '../core/services/crud.service';
import { cacheService } from '../core/services/cache.service';

export interface UseEntityCollectionOptions<T> {
  filterFn?: (item: T) => boolean;
  comparator?: (a: T, b: T) => number;
  initialCacheKey?: string;
}

/**
 * Universal hook to fetch, cache, filter, and observe any entity collection.
 */
export function useEntityCollection<K extends EntityCollection>(
  collection: K,
  options?: UseEntityCollectionOptions<EntityTypeMap[K]>
) {
  type ItemType = EntityTypeMap[K];
  const cacheKey = options?.initialCacheKey || `${collection}:all`;
  const cachedAll = cacheService.peek<ItemType[]>(cacheKey);

  const initialData = useMemo(() => {
    if (!cachedAll) return [];
    let result = cachedAll;
    if (options?.filterFn) {
      result = result.filter(options.filterFn);
    }
    if (options?.comparator) {
      result = [...result].sort(options.comparator);
    }
    return result;
  }, [cachedAll, options?.filterFn, options?.comparator]);

  const [data, setData] = useState<ItemType[]>(initialData);
  const [loading, setLoading] = useState(!cachedAll);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!cacheService.peek<ItemType[]>(cacheKey)) {
      setLoading(true);
    }
    setError(null);
    try {
      let items = await crudService.getAll(collection);
      if (options?.filterFn) {
        items = items.filter(options.filterFn);
      }
      if (options?.comparator) {
        items = [...items].sort(options.comparator);
      }
      setData(items);
    } catch (err: any) {
      setError(err?.message || `Failed to load ${collection}`);
    } finally {
      setLoading(false);
    }
  }, [collection, cacheKey, options?.filterFn, options?.comparator]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch, setData };
}

/**
 * Universal hook to fetch a single entity item by ID with instant L1 cache lookup.
 */
export function useEntityItem<K extends EntityCollection>(
  collection: K,
  id: string | undefined
) {
  type ItemType = EntityTypeMap[K];
  const cacheKey = `${collection}:all`;
  const cachedAll = cacheService.peek<ItemType[]>(cacheKey);
  const cachedSingle = useMemo(() => {
    if (!cachedAll || !id) return null;
    return cachedAll.find((item: any) => item.id === id || item.slug === id) || null;
  }, [cachedAll, id]);

  const [item, setItem] = useState<ItemType | null>(cachedSingle);
  const [loading, setLoading] = useState(!cachedSingle && !!id);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!id) {
      setItem(null);
      setLoading(false);
      return;
    }
    if (!cachedSingle) {
      setLoading(true);
    }
    setError(null);
    try {
      const result = await crudService.getById(collection, id);
      setItem(result);
    } catch (err: any) {
      setError(err?.message || `Item not found in ${collection}`);
    } finally {
      setLoading(false);
    }
  }, [collection, id, cachedSingle]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { item, loading, error, refetch, setItem };
}
