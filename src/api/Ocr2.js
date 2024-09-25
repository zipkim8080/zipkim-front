import axios from 'axios';

const OCR_API_URL =
    '/ocr-api/custom/v1/34182/5c2100025b16243b0c86dbbcdca87c533fc88d3219a8ed07d3fb9e13b6232286/general';
const OCR_SECRET_KEY = 'emd4a3hsTXpQSG5nRmFob1B1bExCaWhBVUxYWWxuT2U=';

export async function requestWithFile(file) {
    const message = {
        images: [
            {
                format: file.type.split('/')[1], // 파일 형식 (예: 'jpg', 'png' 등)
                name: file.name, // 파일 이름
            },
        ],
        requestId: `${new Date().getTime()}`, // 고유한 요청 ID
        timestamp: new Date().getTime(),
        version: 'V2',
        enableTableDetection: true,
    };

    const formData = new FormData();
    formData.append('file', file); // 파일 추가
    formData.append('message', JSON.stringify(message)); // JSON 메시지 추가

    try {
        const response = await axios.post(OCR_API_URL, formData, {
            headers: {
                'X-OCR-SECRET': OCR_SECRET_KEY, // Secret Key만 헤더에 추가
            },
        });

        if (response.status === 200) {
            // 고유번호와 열람일시만 추출해서 리턴
            return extractUniqueAndOpenDate(response.data);
        }
    } catch (error) {
        console.warn('requestWithFile error', error.response);
        throw error;
    }
}

// 고유번호와 열람일시만 추출하는 함수
function extractUniqueAndOpenDate(responseData) {
    const fieldsArray = responseData.images[0].fields;

    const uniqueNumber = fieldsArray[5].inferText; // 고유번호
    const openDate = fieldsArray[fieldsArray.length - 3].inferText; // 열람일시
    const address = () => {
        let addr = '';
        for (let i = 0; i < fieldsArray.length; i++) {
            if (
                fieldsArray[i].inferText.includes('[집합건물]') ||
                fieldsArray[i].inferText.includes('[건물]')
            ) {
                let j = i;
                while (
                    j < fieldsArray.length &&
                    !fieldsArray[j].inferText.includes('표제부')
                ) {
                    addr += fieldsArray[j].inferText + ' ';
                    j++;
                }
            }
        }
        return addr.replace('[집합건물]', '').replace('[건물]', '').trim();
    };

    const loan = () => {
        // 유효 row만 뽑아내기 [순위번호, 해당 row]
        const validEntries = [];

        // 각 페이지마다 접근
        // columnIndex 0에서 유효한 항목이 될 수 있는 후보 모두 뽑아서 리스트에 저장
        for (let i = 0; i < responseData.images.length; i++) {
            for (let x = 0; x < responseData.images[i].tables.length; x++) {
                const tableArrays = responseData.images[i].tables[x].cells;
                for (let j = 0; j < tableArrays.length; j++) {
                    // columnIndex가 0이고, cellTextLines가 비어있지 않은 경우
                    if (
                        tableArrays[j].columnIndex == 0 &&
                        tableArrays[j].cellTextLines &&
                        tableArrays[j].cellTextLines.length > 0 &&
                        tableArrays[j].cellTextLines[0].cellWords &&
                        tableArrays[j].cellTextLines[0].cellWords.length > 0
                    ) {
                        // cellWords 배열이 비어있지 않고, 첫번째 단어의 inferText가 숫자인 경우
                        const firstWord =
                            tableArrays[j].cellTextLines[0].cellWords[0];
                        if (
                            firstWord &&
                            !isNaN(firstWord.inferText.replace(' ', '-'))
                        ) {
                            const number = firstWord.inferText;
                            const rowNum = tableArrays[j].rowIndex;

                            // 조건 확인: 같은 row에 columnIndex가 1이고 근저당권설정인 경우
                            // cellTextLine 기준 '근저당권설정'이 입력된 row를 찾음
                            const targetColumnIndex = tableArrays.findIndex(
                                (cell) =>
                                    cell.rowIndex === rowNum &&
                                    cell.columnIndex === 1 &&
                                    cell.cellTextLines &&
                                    cell.cellTextLines.length > 0 &&
                                    cell.cellTextLines[0].cellWords &&
                                    cell.cellTextLines[0].cellWords.length >
                                        0 &&
                                    cell.cellTextLines[0].cellWords[0].inferText.includes(
                                        '근저당권'
                                    )
                            );

                            const amount = tableArrays.findIndex(
                                (cell) =>
                                    cell.rowIndex === rowNum &&
                                    cell.columnIndex === 4 &&
                                    cell.cellTextLines &&
                                    cell.cellTextLines.length > 0 &&
                                    cell.cellTextLines[0].cellWords &&
                                    cell.cellTextLines[0].cellWords.length >
                                        1 &&
                                    !isNaN(
                                        cell.cellTextLines[0].cellWords[1].inferText
                                            .trim()
                                            .replace('금', '')
                                            .replace('원', '')
                                            .replace(/,/g, '')
                                    )
                            );

                            // '근저당권설정' 이 포함된 row의 4번째 칼럼에 amount가 있을경우 proAmount에 추가
                            if (targetColumnIndex !== -1 && amount !== -1) {
                                const proAmount = parseInt(
                                    tableArrays[
                                        amount
                                    ].cellTextLines[0].cellWords[1].inferText
                                        .trim()
                                        .replace('금', '')
                                        .replace('원', '')
                                        .replace(/,/g, '')
                                );

                                validEntries.push([number, rowNum, proAmount]);
                                console.log('유효한 리스트에 추가된 요소: ', [
                                    number,
                                    rowNum,
                                    proAmount,
                                ]);
                            }
                        }
                    }
                }
            }
        }
        // columnIndex:1 = '근저당권설정' && columnIndex:4 = 숫자인 순위번호 뽑기 완료

        // columnIndex가 1인 것 중 이전, 변경, 말소 라는 단어가 있을 경우 후보 리스트에서 해당 row 항목 제거
        // columnIndex가 1인 애들 검사
        for (let i = 0; i < responseData.images.length; i++) {
            for (let x = 0; x < responseData.images[i].tables.length; x++) {
                const tableArrays = responseData.images[i].tables[x].cells;

                // cell 내 cellTextLines 하나씩 돌기
                for (let j = 0; j < tableArrays.length; j++) {
                    let changeAmount = 0;
                    let targetRow1;
                    let targetNum1;
                    const changeColumnIndex = tableArrays.findIndex(
                        (cell) =>
                            cell.columnIndex === 1 &&
                            cell.cellTextLines &&
                            cell.cellTextLines.length > 0 &&
                            cell.cellTextLines[0].cellWords &&
                            cell.cellTextLines[0].cellWords.length > 0 &&
                            cell.cellTextLines[0].cellWords[0].inferText
                                .trim()
                                .includes('근저당권변경')
                    );

                    // changeColumnIndex가 유효한 경우에만 실행
                    if (changeColumnIndex !== -1) {
                        targetRow1 = tableArrays[changeColumnIndex].rowIndex;
                        targetNum1 = tableArrays[
                            changeColumnIndex
                        ].cellTextLines[0].cellWords[0].inferText
                            .trim()
                            .match(/\d+/)[0]; // 숫자만 추출
                    }

                    // 변경될 changeAmount 뽑기
                    const changeAmountIndex = tableArrays.findIndex(
                        (cell) =>
                            cell.rowIndex === targetRow1 &&
                            cell.columnIndex === 4 &&
                            cell.cellTextLines &&
                            cell.cellTextLines.length > 0 &&
                            cell.cellTextLines[0].cellWords &&
                            cell.cellTextLines[0].cellWords.length > 1 &&
                            !isNaN(
                                cell.cellTextLines[0].cellWords[1].inferText
                                    .trim()
                                    .replace('금', '')
                                    .replace('원', '')
                                    .replace(/,/g, '')
                            )
                    );

                    // columnindex 4번에 금액이 있을 경우 추출
                    if (changeAmountIndex !== -1) {
                        changeAmount = parseInt(
                            tableArrays[
                                changeAmountIndex
                            ].cellTextLines[0].cellWords[1].inferText
                                .trim()
                                .replace('금', '')
                                .replace('원', '')
                                .replace(/,/g, '')
                        );

                        const changeIndex = validEntries.findIndex(
                            (change) => change[0] == targetNum1
                        );

                        if (changeIndex !== -1) {
                            // 기존 금액을 변경 금액으로 업데이트
                            validEntries[changeIndex][2] = changeAmount;
                            console.log(
                                `변경된 금액으로 업데이트: ${targetNum1}번, 변경 금액: ${changeAmount}, 변경된 validEntries: ${validEntries} `
                            );
                        }
                    }

                    let realcellWord = '';
                    // cellTextLines의 columnIndex가 1인 경우만 검사
                    if (tableArrays[j].columnIndex == 1) {
                        // cellTextLines와 cellWords 체크
                        const cellTextLines = tableArrays[j].cellTextLines;
                        // cellTextLines의 cellWords 합치기
                        for (
                            let k = 0;
                            k < tableArrays[j].cellTextLines.length;
                            k++
                        ) {
                            const cellWords =
                                tableArrays[j].cellTextLines[k].cellWords;
                            if (cellWords && cellWords.length > 0) {
                                for (let l = 0; l < cellWords.length; l++) {
                                    realcellWord += cellWords[l].inferText;
                                }
                            }
                        }
                    }
                    // realcellWord에 문자열 시작이 숫자고 마지막이 말소라면 해당 숫자번호와 일치하는 리스트 삭제
                    if (
                        !isNaN(
                            realcellWord
                                .trim()
                                .slice(0, 3)
                                .replace('번근', '')
                                .replace('번', '')
                        ) &&
                        realcellWord.trim().slice(-2) == '말소'
                    ) {
                        console.log('realcellWord : ', realcellWord);
                        const targetNum = realcellWord
                            .trim()
                            .slice(0, 3)
                            .replace('번근', '')
                            .replace('번', '');
                        console.log(realcellWord);
                        console.log('targetNum: ', targetNum);
                        const index = validEntries.findIndex(
                            (entry) => entry[0] == targetNum
                        );

                        if (index !== -1) {
                            console.log(`말소된 순위번호: ${targetNum}번 삭제`);
                            validEntries.splice(index, 1);
                        }
                    }
                }
            }
        }

        console.log('최종 유효한 entries:', validEntries);
        let loan = 0;
        for (let c = 0; c < validEntries.length; c++) {
            loan += validEntries[c][2];
        }

        return loan;
    };

    return {
        uniqueNumber,
        openDate,
        address: address(),
        loan: loan(),
    };
}
