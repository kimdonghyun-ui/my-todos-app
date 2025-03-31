export function handleFileUpload(
	event: React.ChangeEvent<HTMLInputElement>,
): Promise<string> {
	return new Promise((resolve, reject) => {
		const file = event.target.files?.[0];
		if (!file) return reject("파일 없음!");

		const reader = new FileReader();
		reader.onload = async e => {
			const img = new Image();
			img.src = e.target?.result as string;

			img.onload = () => {
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");

				canvas.width = img.width;
				canvas.height = img.height;
				ctx?.drawImage(img, 0, 0);

				// 🚀 Canvas 데이터를 SVG 형식으로 변환
				const svgString = `
			<svg width="${canvas.width}" height="${canvas.height}" style="width: 100%; height: 100%;" xmlns="http://www.w3.org/2000/svg">
			  <image href="${canvas.toDataURL("image/png")}" width="${canvas.width}" height="${canvas.height}" style="width: 100%; height: 100%;" />
			</svg>
		  `;

				// console.log("SVG 코드:", svgString);
				resolve(svgString); // ✅ 비동기 작업 완료 후 svgString 반환
			};

			img.onerror = reject;
		};

		reader.readAsDataURL(file); // 🚀 파일을 Base64 문자열로 변환 (필수)
	});
}
