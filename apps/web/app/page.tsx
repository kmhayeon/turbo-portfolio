'use client';

import Button from "../components/Button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col gap-6 items-center justify-center bg-gray-100 text-black">
      <h1 className="text-3xl font-bold">🚀 Tailwind 세팅 완료!</h1>
      <Button label="기본 버튼" onClick={() => alert('버튼 클릭됨!')}/>
      <Button label="비활성화 버튼" disabled/>
    </main>
  )
}
