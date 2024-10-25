import React , {useEffect , useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import styled from 'styled-components';
import axios from "axios";
import { useConstants } from '../context/ConstantsContext';

const Payment = () => {
    const { API_URL } = useConstants();
    const { storeId, datetime } = useParams(); // URL 파라미터에서 storeId와 time 가져오기
    const [store , setStore] = useState({});
    const navigate = useNavigate(); // navigate 훅 사용

    const generateRandomString = () => window.btoa(Math.random()).slice(0, 20);
    const clientKey = "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";
    const customerKey = generateRandomString();
    const [ready, setReady] = useState(false);
    const [payment, setPayment] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('Authorization'); // 토큰 가져오기
        if (!token) {
            navigate('/'); // 토큰이 없으면 로그인 화면으로 리디렉션
        }
    }, [navigate]); // navigate가 변경될 때마다 실행

    useEffect(() => {
        const getStore = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/v1/user/stores/${storeId}`, {
                    headers: {
                        Authorization: localStorage.getItem('Authorization'), // 여기에 실제 토큰 값을 넣으세요
                    }
                });

                const data = response.data.data;

                setStore({
                    title : data.title,
                    deposit : data.deposit
                });

                console.log('Signup response:', response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        getStore();
    }, []);


    useEffect(() => {
        async function fetchPayment() {
            try {
                const tossPayments = await loadTossPayments(clientKey);

                // 회원 결제
                // @docs https://docs.tosspayments.com/sdk/v2/js#tosspaymentspayment
                const payment = tossPayments.payment({
                    customerKey,
                });
                // 비회원 결제
                // const payment = tossPayments.payment({ customerKey: ANONYMOUS });

                setPayment(payment);
            } catch (error) {
                console.error("Error fetching payment:", error);
            }
        }

        fetchPayment();
    }, [clientKey, customerKey]);




    const handlePayment = async () => {
        try {
            const dt = datetime.split(" ");
            const response = await axios.get(`${API_URL}/api/v2/payment/prepare`, {
                headers: {
                    Authorization: localStorage.getItem('Authorization'),
                },
                params: {
                    storeId : storeId,
                    date : dt[0],
                    time : dt[1],
                    numberPeople : 2,
                    amount : store.deposit
                },
            });

            const result = response.data;
            if (result.status === 200) {
                await payment.requestPayment({
                    method: "CARD", // 카드 및 간편결제
                    amount: result.data.amount,
                    orderId: result.data.orderId,
                    orderName: "토스 티셔츠 외 2건",
                    successUrl: `${API_URL}/api/v2/payment/success` + window.location.search,
                    failUrl: `${API_URL}/api/v2/payment/fail` + window.location.search,
                    customerEmail: "customer123@gmail.com",
                    customerName: "김토스",
                    customerMobilePhone: "01012341234",
                    card: {
                        useEscrow: false,
                        flowMode: "DEFAULT",
                        useCardPoint: false,
                        useAppCardOnly: false,
                    },
                });
            }
        } catch (err) {
            // 에러 처리
            console.error('Login error:', err.response ? err.response.data : err.message);
        }
    }

    return (
        <PaymentContainer>
            <ContentWrapper>
                <h1>가게 정보</h1>
                {/* 가게 정보와 예약 시간 표시 */}
                <p>가게 명: {store.title}</p>
                <p>예약 시간: {datetime}</p>
                {/* 결제 관련 UI 구성 */}
                <Price>선 예약금: {store.deposit}원</Price>
                <div id="payment-method" className="w-100"/>
                <div id="agreement" className="w-100"/>
                <ReservationButton onClick={handlePayment}>예약하기</ReservationButton>
            </ContentWrapper>
        </PaymentContainer>
    );
};

// Styled components 정의
const PaymentContainer = styled.div`
    display: flex;
    justify-content: center; /* 가로 방향 가운데 정렬 */
    align-items: center; /* 세로 방향 가운데 정렬 */
    height: 100vh; /* 전체 화면 높이 */
    background-color: #f8f9fa; /* 배경색 */
`;

const ContentWrapper = styled.div`
    padding: 20px;
    background-color: white; /* 카드 배경색 */
    border-radius: 8px; /* 모서리 둥글게 */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
    width: 80%; /* 너비 조정 */
    max-width: 600px; /* 최대 너비 조정 */
    text-align: center; /* 텍스트 가운데 정렬 */
`;

const Price = styled.p`
    font-size: 24px; /* 가격 폰트 크기 조정 */
    margin: 10px 0; /* 위아래 여백 조정 */
`;

const ReservationButton = styled.button`
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    width: 100%; /* 버튼 100% 너비 */
    margin-top: 20px; /* 버튼 위 여백 */
`;

export default Payment;
