import './App.css';
import reset from 'styled-reset'
import { createGlobalStyle } from 'styled-components'
import Styled from "styled-components";
import { useRef, useEffect, useState } from 'react';

const { kakao } = window
// index.html 에서 불러온 라이브러리를 윈도우 객체를 이용해서 불러온다.

const GlobalStyles = createGlobalStyle`
    ${reset}
`;
// Styled-components 의 전역 스타일을 이용하여 CSS를 초기화한다.

const Container = Styled.div`
  height: 100vh;
  display : flex;
  justify-content : center;
  align-items : center;
`

const MapContainer = Styled.div`
  width : 600px;
  height : 600px;

  border : 2px solid gray;
  border-radius : 10px;

  box-shadow : 10px 10px 10px gray;
`

const Info = Styled.div`
  margin-left : 20px;

  h1{
    margin-bottom : 20px;

    font-size : 1.5rem;
    font-weight : bold;

    text-shadow : 1px 3px 2px rgba(0,0,0,0.2);
  }
  .title{
    margin : 5px 0;

    font-weight : bold;
    text-shadow : 1px 1px 2px rgba(0,0,0,0.2);
  }
  /* 위처럼 작성하면, 컴포넌트 내부의 자식 요소들의 스타일을 지정해 줄 수 있다. */
`

function App() {
  const kakaoMap = useRef()
  // DOM 주소대신 useRef 를 사용하여 해당 요소의 DOM 주소를 저장한다.
  // useRef는 언제 사용한다? -> 리액트에서 DOM 써야할때.

  const [latlng, setLatlng] = useState([])
  const [address, setAddress] = useState([])
  // 각각의 상태에 좌표와 주소를 저장한다.
  // 좌표 - 위도 경도
  // 주소 - 도로명 주소, 지번 주소

  useEffect(() => {
    // const container = kakaoMap
    // 지도를 불러올 요소를 container 에 할당한다.
    // useRef 를 사용하므로 useRef의 변수명을 바로 작성해도 되므로 생략가능

    let options = {
      // 불러온 카카오 지도의 옵션을 설정한다.
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      // 지도 중앙 설정
      level: 3
      // 지도 확대 수준 설정
    };
    let map = new kakao.maps.Map(kakaoMap.current, options);
    // 지도를 불러오는 실질적인 부분 (지도를 불러올 요소, 옵션)
    // useRef 로 지정한 요소를 사용하기 위해서는 current 를 필수로 붙혀줘야함.

    let marker = new kakao.maps.Marker()
    // 마커를 생성하는 생성자를 marker 변수에 할당한다.

    marker.setMap(map)
    // 마커가 그려질 지도를 설정한다.
    // 현재 문서에서는 지도를 만드는 생성자가 map 이라는 변수에 할당되어 있으므로 map 을 작성한다.
    // map -> 74번째 줄

    kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
      // 라이브러리에서 제공하는 이벤트리스너를 사용한다.
      // (적용시킬 지도, 이벤트, 콜백함수)
      // 콜백함수에서 첫번째 인자는 이벤트의 결과를 가진다.

      let latlng = mouseEvent.latLng
      // mouseEvent.latLng로 마우스를 클릭한 위치의 좌표를 가져오고, 값을 latlng에 저장한다.
      // La 는 경도, Ma는 위도를 뜻한다.

      marker.setPosition(latlng)
      // 마커의 위치를 좌표(위에서 할당한 latlng 변수)로 설정한다.

      // 즉, 현재 지도에 클릭이 일어난 경우 현재 함수가 실행되므로, 매 클릭마다 새로운 좌표값이 latlng로 설정되기 때문에
      // 내가 클릭한 곳의 위치로 마커가 설정 될 수 있는 것.

      setLatlng(latlng)
      // 좌표를 상태에 저장한다.

      let geocoder = new kakao.maps.services.Geocoder()
      // 좌표 -> 주소 변환 API를 사용한다.

      geocoder.coord2Address(latlng.La, latlng.Ma, (result, status) => {
        // 각각 경도, 위도, 콜백 함수를 인자로 사용한다.
        // 콜백함수의 첫번째 값은 좌표의 변환 결과, 두번째 값은 통신의 결과를 반환한다.
        
        if (status === kakao.maps.services.Status.OK) {
          setAddress(result[0])
          // 이 때, 통신의 결과가 OK인 경우에 result에 변환 결과가 담겨오게 되므로,
          // 통신의 결과가 OK 인 경우에만 상태에 해당 결과를 저장하게끔 한다.
        }
      })
    })
  }, [])
  // 내부의 내용이 페이지가 새로고침되는 최초 1회에만 랜더링된다.

  return (
    <div className="App">
      <GlobalStyles />
      <Container>
        <MapContainer ref={kakaoMap} />
        {/* useRef 로 해당 위치를 kakaoMap에 저장한다. */}
        <Info>
          <h1>위치정보</h1>
          <div className='title'>경도</div>
          <div className='info'>{latlng.La}</div>
          <div className='title'>위도</div>
          <div className='info'>{latlng.Ma}</div>
          <div className='title'>도로명 주소</div>
          <div className='info'>{address.road_address ? address.road_address.address_name : '없음'}</div>
          {/* 조건부 렌더링으로 주소가 있는 경우에만 해당 주소를 표시한다. */}
          <div className='title'>직원 주소</div>
          <div className='info'>{address.address ? address.address.address_name : '없음'}</div>
          {/* 조건부 렌더링으로 주소가 있는 경우에만 해당 주소를 표시한다. */}
          {/* 조건부 렌더링 하는 이유는 도로명주소가 있는 경우도 있고, 없는 경우도 있기 때문에 위처럼 처리해주어야함. */}
        </Info>
      </Container>
    </div>
  );
}

export default App;
