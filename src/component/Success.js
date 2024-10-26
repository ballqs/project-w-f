import { useState } from "react";
import { useSearchParams , useNavigate } from "react-router-dom";

const Success = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");

    return (
        <div className="wrapper w-100">
            <div
                className="flex-column align-center confirm-success w-100 max-w-540"
                style={{
                    display: "flex"
                }}
            >
                <img
                    src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
                    width="120"
                    height="120"
                />
                <h2 className="title">결제를 완료했어요</h2>
                <div className="response-section w-100">
                    <div className="flex justify-between">
                        <span className="response-label">결제 금액</span>
                        <span id="amount" className="response-text">
                {amount}
              </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="response-label">주문번호</span>
                        <span id="orderId" className="response-text">
                {orderId}
              </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="response-label">paymentKey</span>
                        <span id="paymentKey" className="response-text">
                {paymentKey}
              </span>
                    </div>
                </div>

                <div className="w-100 button-group">

                    <div className="flex" style={{gap: "16px"}}>
                        <a
                            className="btn w-100"
                            href="https://developers.tosspayments.com/sandbox"
                        >
                            다시 테스트하기
                        </a>
                        <a
                            className="btn w-100"
                            href="https://docs.tosspayments.com/guides/v2/payment-widget/integration"
                            target="_blank"
                            rel="noopner noreferer"
                        >
                            결제 연동 문서가기
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Success;