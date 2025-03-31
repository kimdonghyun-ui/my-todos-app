type ProfileImageProps = {
	svgString: string;
	width?: number;
	height?: number;
	className?: string;
	alt?: string;
};

const ProfileImage = ({
	svgString,
	width = 50,
	height = 50,
	className = "",
	alt = "Profile Image",
}: ProfileImageProps) => {
	if (!svgString) {
		return <p>{alt}</p>;
	}

	return (
		<div
			className={className}
			style={{ width, height }}
			aria-label={alt} // ✅ 접근성 추가
			role="img" // ✅ 스크린리더에서 이미지로 인식
			dangerouslySetInnerHTML={{ __html: svgString }}
		/>
	);
};

export default ProfileImage;
