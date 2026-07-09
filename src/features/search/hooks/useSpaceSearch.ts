"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { getSpaces } from "@/apis/space";
import type { SpaceListSearchResponse } from "@/types/space";

const PAGE_SIZE = 12;

export function useSpaceSearch() {
  const searchParams = useSearchParams();
  const initialName = searchParams.get("name") ?? "";
  const initialCategory = searchParams.get("category") ?? "";
  const [searchValue, setSearchValue] = useState(initialName);
  const [submittedName, setSubmittedName] = useState(initialName);
  const [category, setCategory] = useState(initialCategory);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [spaces, setSpaces] = useState<SpaceListSearchResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadSpaces = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getSpaces({
          name: submittedName || undefined,
          category: category || undefined,
        });
        const nextSpaces = response.data.spaces;

        if (isActive) {
          setSpaces(nextSpaces);
          setCategoryOptions((current) => Array.from(new Set([
            ...current,
            ...nextSpaces.map((space) => space.category).filter(Boolean),
          ])));
          setCurrentPage(1);
        }
      } catch {
        if (isActive) setError("공간 검색 결과를 불러오지 못했습니다.");
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadSpaces();
    return () => {
      isActive = false;
    };
  }, [category, submittedName]);

  const submitSearch = useCallback(() => {
    setSubmittedName(searchValue.trim());
  }, [searchValue]);

  const totalPages = Math.max(1, Math.ceil(spaces.length / PAGE_SIZE));
  const visibleSpaces = spaces.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return {
    category,
    categoryOptions,
    currentPage,
    error,
    isLoading,
    searchValue,
    setCategory,
    setCurrentPage,
    setSearchValue,
    spaces,
    submitSearch,
    totalPages,
    visibleSpaces,
  };
}
