export default function AdminSpacesPanel() {
  return (
    <section className="flex flex-col gap-[24px] rounded-[30px] bg-white p-[28px]">
      <h2 className="text-[30px] font-bold text-[#222831]">요청된 공간</h2>
      <div className="grid gap-[24px] md:grid-cols-3">
        {["받은 요청", "검토 대기", "승인된 공간"].map((label) => (
          <div className="flex flex-col gap-[8px] rounded-[24px] bg-[#F7F7F7] p-[22px]" key={label}>
            <p className="text-[14px] font-semibold text-[#5E687E]">{label}</p>
            <p className="text-[34px] font-bold text-[#222831]">--</p>
          </div>
        ))}
      </div>
      <div className="rounded-[24px] bg-[#F7F7F7] px-[24px] py-[64px] text-center">
        <p className="text-[16px] font-semibold text-[#222831]">공간 승인 요청 조회 API가 준비되지 않았습니다.</p>
        <p className="mt-[8px] text-[14px] text-[#67728A]">조회 API가 연결되면 이 영역에 승인 및 거부 목록이 표시됩니다.</p>
      </div>
    </section>
  );
}
