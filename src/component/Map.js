import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map as KakaoMap, MapMarker } from "react-kakao-maps-sdk";

const Map = () => {
    const navigate = useNavigate();
    const [center, setCenter] = useState({
        lat: 37.5665, // 서울의 위도
        lng: 126.978, // 서울의 경도
    });

    const [markers, setMarkers] = useState([
        { id: 1, lat: 37.5665, lng: 126.978 }, // 서울
        { id: 2, lat: 37.5700, lng: 126.985 }, // 다른 위치 예시
        { id: 3, lat: 37.5750, lng: 126.970 }, // 또 다른 위치 예시
    ]);

    const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태
    const [places, setPlaces] = useState([]); // 검색 결과 상태

    // 로그인 여부 확인
    useEffect(() => {
        const token = localStorage.getItem('token'); // 또는 Redux에서 관리하는 토큰 확인
        if (!token) {
            navigate('/'); // 로그인하지 않은 경우 리다이렉트
        }
    }, [navigate]);

    // 카카오 장소 검색 API를 호출하여 검색
    const searchPlaces = () => {
        const ps = new window.kakao.maps.services.Places();

        ps.keywordSearch(searchQuery, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const newMarkers = data.map((place, index) => ({
                    id: index + 1,
                    lat: parseFloat(place.y),
                    lng: parseFloat(place.x),
                    place_name: place.place_name,
                }));

                setMarkers(newMarkers);
                if (newMarkers.length > 0) {
                    // 검색된 첫 번째 결과를 중심으로 지도 이동
                    setCenter({
                        lat: newMarkers[0].lat,
                        lng: newMarkers[0].lng,
                    });
                }
            } else {
                alert("검색 결과가 없습니다.");
            }
        });
    };

    return (
        <div style={styles.container}>
            <h2>맵</h2>
            {/* 검색창과 버튼 */}
            <div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="검색어를 입력하세요"
                    style={styles.input}
                />
                <button onClick={searchPlaces} style={styles.button}>검색</button>
            </div>
            <div style={styles.mapContainer}>
                <KakaoMap
                    center={center}
                    style={{ width: "500px", height: "500px" }}
                    level={3} // 확대 수준
                >
                    {markers.map((marker) => (
                        <MapMarker
                            key={marker.id}
                            position={{ lat: marker.lat, lng: marker.lng }}
                        >
                            {/* 마커에 인포윈도우 표시 */}
                            <div style={styles.infoWindow}>
                                {marker.place_name}
                            </div>
                        </MapMarker>
                    ))}
                </KakaoMap>
            </div>
        </div>
    );
};

// 간단한 스타일을 위한 객체
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0',
    },
    mapContainer: {
        marginTop: '20px',
    },
    input: {
        padding: '8px',
        width: '300px',
        marginRight: '10px',
        borderRadius: '4px',
        border: '1px solid #ddd',
    },
    button: {
        padding: '8px 16px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#007BFF',
        color: '#fff',
        cursor: 'pointer',
    },
    infoWindow: {
        padding: '5px',
        fontSize: '12px',
    },
};

export default Map;
