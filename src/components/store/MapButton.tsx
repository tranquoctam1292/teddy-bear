'use client';

// Client Component cho Map Button
interface MapButtonProps {
  lat: number;
  lng: number;
}

export default function MapButton({ lat, lng }: MapButtonProps) {
  const handleOpenMap = () => {
    window.open(
      `https://www.google.com/maps?q=${lat},${lng}`,
      '_blank'
    );
  };

  return (
    <button
      onClick={handleOpenMap}
      className="mt-6 w-full bg-pink-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-pink-700 transition-colors"
    >
      Xem trên bản đồ
    </button>
  );
}



