import React , {useEffect , useState} from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useInView } from "react-intersection-observer";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useConstants } from '../context/ConstantsContext';

const Stores = () => {

    const calculateAvailableSlots = (openTime, closeTime, turnOver) => {
        const slots = [];
        const start = new Date(`1970-01-01T${openTime}Z`);
        const end = new Date(`1970-01-01T${closeTime}Z`);
        const turnoverMinutes = parseInt(turnOver.split(':')[1]);

        for (let time = start; time <= end; time.setMinutes(time.getMinutes() + turnoverMinutes)) {
            slots.push(time.toISOString().substring(11, 19)); // HH:mm 형식으로 변환
        }

        return slots;
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
        const day = String(date.getDate()).padStart(2, '0'); // 날짜를 2자리로 포맷

        return `${year}-${month}-${day}`;
    };

    const { API_URL } = useConstants();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
    const [storeList , setStoreList] = useState([]);

    // 무한 스크롤
    const [ref, inView] = useInView()
    const [page , setPage] = useState(0);
    const [size , setSize] = useState(10);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearch = async (e) => {
        setPage(0); // 페이지를 0로 리셋
        setStoreList([]); // 리스트 초기화
        fetchStores();
    };

    const handleReservation = (e) => {
        const storeId = e.target.dataset.idx;
        const time = e.target.dataset.time;
        navigate(`/payment/${storeId}/${selectedDate} ${time}`);
    }

    const fetchStores = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/v1/user/stores/search`, {
                headers: {
                    Authorization: localStorage.getItem('Authorization'), // 여기에 실제 토큰 값을 넣으세요
                },
                params: {
                    storeName: searchTerm, // 쿼리 파라미터로 username을 추가
                    size : size,
                    page : page
                },
            });

            const data = response.data.data.content;

            let list = [];
            if (data.length > 0) {
                for(let idx in data) {
                    list[idx] = {
                        id : data[idx].id,
                        title : data[idx].title,
                        image : "https://png.pngtree.com/thumb_back/fh260/background/20220318/pngtree-photography-of-chinese-food-restaurant-image_1020164.jpg",
                        openTime : data[idx].openTime,
                        closeTime : data[idx].closeTime,
                        deposit : data[idx].deposit,
                        address : data[idx].address,
                        turnOver : data[idx].turnover,
                        slot : calculateAvailableSlots(data[idx].openTime, data[idx].closeTime, data[idx].turnover)
                    }
                }
                setStoreList(prevStores => {
                    const existingIds = new Set(prevStores.map(store => store.id));
                    return [...prevStores, ...list.filter(store => !existingIds.has(store.id))];
                });
            }
            console.log('Signup response:', response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchStores();
    }, [page]); // 페이지가 변경될 때마다 호출

    useEffect(() => {
        if (inView) {
            setPage((prev) => prev + 1); // 무한 스크롤이 활성화되면 페이지 번호 증가
        }
    }, [inView]);

    return (
        <AppContainer>
            <Container>
                <h1>가게 검색</h1>
                <SearchContainer>
                    <SearchInput
                        type="text"
                        placeholder="가게명을 입력하세요"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <DatePickerStyled
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(formatDate(date))}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="날짜 선택"
                    />
                    <SearchButton onClick={handleSearch}>검색</SearchButton>
                </SearchContainer>

                <ItemContainer>
                    {storeList.map((item , idx) => (
                        <Item key={idx}>
                            <ItemImage src={item.image} alt="가게 이미지"/>
                            <h2>{item.title}</h2>
                            <p>운영시간 : {item.openTime} ~ {item.closeTime} , 지역 : {item.address}</p>
                            <h3>예약금액 : {item.deposit}원</h3>
                            <h3>예약가능시간</h3>
                            <OpenHours>
                                {item.slot.map((slot, idx) => (
                                    <HourButton key={idx} data-idx={item.id} data-time={slot} onClick={handleReservation} >{slot}</HourButton>
                                ))}
                            </OpenHours>
                        </Item>
                    ))}
                </ItemContainer>
                <div ref={ref} style={{ height: '20px' }} /> {/* 감지할 요소 */}
            </Container>
        </AppContainer>
    );
};

export default Stores;


const AppContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start; /* 상단 정렬 */
    height: 100vh;
    background-color: #f8f9fa;
`;

const Container = styled.div`
    padding: 20px;
    width: 650px;
    background-color: white; /* 카드 배경색 */
    border-radius: 8px; /* 모서리 둥글게 */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
`;

const DatePickerStyled = styled(DatePicker)`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 97%; /* 너비를 100%로 설정하여 가로 공간을 차지하도록 */
`;

const SearchContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    gap: 10px; /* 요소 간 간격을 추가 */
`;

const SearchInput = styled.input`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 97%; /* 너비를 100%로 설정하여 가로 공간을 차지하도록 */
`;

const SearchButton = styled.button`
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    width: 100%; /* 버튼도 100% 너비로 설정 */
`;

const ItemContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const Item = styled.div`
    border: 1px solid #ddd;
    padding: 10px;
`;

const ItemImage = styled.img`
    width: 100%;
    height: auto;
`;

const OpenHours = styled.div`
    overflow: auto;
    display: flex;
    gap: 10px;
    margin: 10px 0;
    
    /* 스크롤바 숨기기 */
    &::-webkit-scrollbar {
        display: none; /* 크롬, 사파리, 엣지에서 스크롤바 숨기기 */
    }
`;

const HourButton = styled.span`
    padding: 5px 10px;
    border: 1px solid #ccc;
    cursor: pointer;
`;