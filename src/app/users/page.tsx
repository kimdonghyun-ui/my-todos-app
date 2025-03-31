'use client';

import { fetchApi } from "@/lib/fetchApi";
import { useEffect, useMemo } from "react";
import { useRouter } from 'next/navigation';

export default function MePage() {
	const router = useRouter();
	
	const apiOptions: RequestInit = useMemo(
		() => ({
			method: "GET",
			cache: "no-store",
		}),
		[],
	);

	useEffect(() => {
		// ✅ useEffect 내부에서 async 함수를 따로 선언해서 실행
		const fetchData = async () => {
			const response = await fetchApi(
				"/users",
				apiOptions,
				true,
			);
			console.log("response", response);
		};

		fetchData(); // ✅ 선언한 함수 실행
	}, [apiOptions]);

	return (
		<div className="p-4">
		  <h1 className="text-2xl font-bold mb-4">me 페이지</h1>
		  
		  <button onClick={() => {
			router.push('/');
		  }}>프로필</button>
		</div>
	  );
}