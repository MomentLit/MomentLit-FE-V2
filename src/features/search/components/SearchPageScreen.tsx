"use client";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Pagination from "@/components/common/Pagination";
import SpaceCard from "@/components/ui/SpaceCard";

import { useSpaceSearch } from "../hooks/useSpaceSearch";

export default function SearchPageScreen() {
  const search = useSpaceSearch();

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Header
        categoryOptions={search.categoryOptions}
        categoryValue={search.category}
        onCategoryChange={search.setCategory}
        onSearch={search.submitSearch}
        onSearchValueChange={search.setSearchValue}
        searchValue={search.searchValue}
        type="topSearch"
      />
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-[32px] px-[20px] py-[48px] sm:px-[32px] lg:px-[50px]">
        <h1 className="text-[32px] font-extrabold leading-normal text-[#222831] sm:text-[48px]">
          <span className="text-[#00ADB5]">{search.spaces.length}개</span>의 공간이 검색되었습니다.
        </h1>

        {search.isLoading && <p className="py-[120px] text-center text-[#67728A]">공간을 검색하는 중입니다.</p>}
        {!search.isLoading && search.error && <p className="py-[120px] text-center text-[#DA294A]">{search.error}</p>}
        {!search.isLoading && !search.error && search.visibleSpaces.length === 0 && (
          <p className="rounded-[12px] bg-white px-[20px] py-[120px] text-center text-[#67728A]">검색 조건에 맞는 공간이 없습니다.</p>
        )}
        {!search.isLoading && !search.error && search.visibleSpaces.length > 0 && (
          <div className="grid gap-x-[32px] gap-y-[64px] sm:grid-cols-2 xl:grid-cols-4 xl:justify-between">
            {search.visibleSpaces.map((space) => (
              <SpaceCard
                address={space.address.road_address || space.address.jibun_address}
                imageUrl={space.thumbnail_url || undefined}
                key={space.space_id}
                price={`${space.price_per_hour.toLocaleString("ko-KR")}원`}
                title={space.name}
              />
            ))}
          </div>
        )}
        {!search.isLoading && !search.error && search.spaces.length > 0 && (
          <Pagination
            className="mt-[32px]"
            currentPage={search.currentPage}
            onPageChange={search.setCurrentPage}
            totalPages={search.totalPages}
          />
        )}
      </main>
      <Footer className="mt-[64px]" variant="mainPage" />
    </div>
  );
}
