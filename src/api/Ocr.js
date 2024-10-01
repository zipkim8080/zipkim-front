import axios from 'axios';
const OCR_API_URL = import.meta.env.VITE_OCR_API_URL;
const OCR_SECRET_KEY = import.meta.env.VITE_OCR_SECRET_KEY;

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
            return ocrParse(response.data);
        }
    } catch (error) {
        console.warn('requestWithFile error', error.response);
        throw error;
    }
}

// 각 구역별 Cell 나누기
function ocrParse(responseData) {
    let currentSection = 'Pyojeboo'; // 초기 구역을 표제부로 설정
    const gabgooTableList = []; // 갑구 테이블 리스트
    const eulgooTableList = []; // 을구 테이블 리스트
    let gabgooList = []; // 갑구 입력받을 리스트
    let loanEntries = []; // 모든 근저당을 저장할 리스트
    let leaseEntries = []; // 모든 전세권을 저장할 리스트

    let attachment1 = false;
    let attachment2 = false;
    let trust = false;
    let auction = false;
    let loan = 0;
    let leaseAmount = 0;

    // 각 Image의 table 분석
    for (const image of responseData['images']) {
        const tables = image['tables'];

        // table이 없는 경우 예외처리
        for (const table of tables || []) {
            const firstCell = table['cells'][0];
            const cellTextLines = firstCell['cellTextLines'];

            // 첫번째 셀 텍스트라인 추출
            const firstLine =
                cellTextLines.length > 0 ? cellTextLines[0] : null;
            const firstCellWord = firstLine
                ? firstLine['cellWords'][0].inferText
                : '';

            // '갑구', '을구' 구역 시작 확인
            if (
                firstCellWord.includes('갑구') ||
                firstCellWord.includes('갑')
            ) {
                currentSection = 'Gabgoo';
            } else if (
                firstCellWord.includes('을구') ||
                firstCellWord.includes('을')
            ) {
                currentSection = 'Eulgoo';
            }

            if (currentSection === 'Gabgoo') {
                gabgooTableList.push(table);
            } else if (currentSection === 'Eulgoo') {
                eulgooTableList.push(table);
            }
        }
    }

    // 갑구 테이블 리스트 처리 (필요시 추가 로직 구현)
    for (const table of gabgooTableList) {
        // 갑구 테이블 로직 처리
        parse_gabgoo_table(table, gabgooList);
        for (let i = 0; i < gabgooList.length; i++) {
            if (gabgooList[i] === '압류') attachment1 = true;
            else if (gabgooList[i] === '가압류') attachment2 = true;
            else if (gabgooList[i] === '신탁') trust = true;
            else if (gabgooList[i] === '경매개시결정') auction = true;
        }
    }

    // 을구 테이블 리스트 처리
    for (const table of eulgooTableList) {
        parse_elgoo_table(table, loanEntries, leaseEntries);
    }

    const subInfo = subInformation(responseData);

    // console.log('최종 유효한 근저당 리스크', loanEntries);
    // console.log('최종 유효한 전세권 리스크', leaseEntries);

    // 근저당 추출 로직
    for (const loanElement of loanEntries) {
        loan += parseInt(loanElement[2], 10); // 근저당 금액 추출 (10진수로 명시적으로 지정)
    }

    // 전세권 추출 로직
    for (const leaseElement of leaseEntries) {
        leaseAmount += parseInt(leaseElement[2], 10); // 전세권 금액 추출 (10진수로 명시적으로 지정)
    }

    return {
        uniqueNumber: subInfo.uniqueNumber,
        openDate: subInfo.openDate,
        address: subInfo.address,
        trust,
        attachment1,
        attachment2,
        auction,
        loan,
        leaseAmount,
    };
}

function subInformation(responseData) {
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

    return {
        uniqueNumber,
        openDate,
        address: address(),
    };
}

function parse_gabgoo_table(table, gabgooList) {
    // gabgooList
    // console.log('갑구 리스트 : ', gabgooList);
    const cells = table['cells'];

    for (let i = 0; i < cells.length; i++) {
        let cell = cells[i];

        // 등기목적이 columnIndex=1인 셀만 처리
        if (cell['columnIndex'] === 1) {
            const cellTextLines = cell['cellTextLines'];

            // 각 라인 처리
            const lines = cellTextLines.map(function (line) {
                const words = line['cellWords'];

                // 각 단어에서 inferText 추출
                const wordTexts = words.map(function (word) {
                    return word['inferText'];
                });

                return wordTexts.join('');
            });

            const text = lines.join('');
            // console.log('갑구 텍스트: ', text);

            // 조건에 따라 경매개시결정/가압류/압류/신탁 추가
            if (text.includes('경매개시결정') && !text.includes('말소')) {
                gabgooList.push('경매개시결정');
            } else if (
                (text.includes('가압류') ||
                    text.includes('가업류') ||
                    text.includes('거압류') ||
                    text.includes('거업류') ||
                    text.includes('기압류') ||
                    text.includes('기업류')) &&
                !text.includes('말소')
            ) {
                gabgooList.push('가압류');
            } else if (text.includes('압류') && !text.includes('말소')) {
                gabgooList.push('압류');
            } else if (text.includes('신탁') && !text.includes('말소')) {
                gabgooList.push('신탁');
            }

            // 조건에 따라 경매개시결정/가압류/압류/신탁 제거
            if (
                text.includes('경매개시결정등기말소') &&
                gabgooList.includes('경매개시결정')
            ) {
                gabgooList.splice(gabgooList.indexOf('경매개시결정'), 1);
            } else if (
                text.includes('가압류등기말소') &&
                gabgooList.includes('가압류')
            ) {
                gabgooList.splice(gabgooList.indexOf('가압류'), 1);
            } else if (
                text.includes('압류등기말소') &&
                gabgooList.includes('압류')
            ) {
                gabgooList.splice(gabgooList.indexOf('압류'), 1);
            } else if (
                text.includes('신탁등기말소') &&
                gabgooList.includes('신탁')
            ) {
                gabgooList.splice(gabgooList.indexOf('신탁'), 1);
            }
        }
    }
}

// 을구(근저당액, 전세권 금액) 테이블 하나 처리
function parse_elgoo_table(table, loanEntries, leaseEntries) {
    // table 내 각 cell 하나씩 처리
    for (const cell of table.cells) {
        // 근저당 리스트 추가
        if (cell.columnIndex === 0 && cell.cellTextLines.length > 0) {
            const firstWord = cell.cellTextLines[0].cellWords[0];
            if (firstWord && !isNaN(firstWord.inferText.replace(' ', '-'))) {
                const number = firstWord.inferText;
                const rowNum = cell.rowIndex;

                // 근저당권 설정 확인
                const targetColumnIndex = table.cells.findIndex(
                    (cell) =>
                        cell.rowIndex === rowNum &&
                        cell.columnIndex === 1 &&
                        cell.cellTextLines.length > 0 &&
                        cell.cellTextLines[0].cellWords.length > 0 &&
                        cell.cellTextLines[0].cellWords[0].inferText.includes(
                            '근저당권'
                        )
                );

                // 같은 row에서 columnIndex 4인 cell에 있는 금액 추출
                const amountIndex = table.cells.findIndex(
                    (cell) =>
                        cell.rowIndex === rowNum &&
                        cell.columnIndex === 4 &&
                        cell.cellTextLines.length > 0 &&
                        cell.cellTextLines[0].cellWords.length > 1 &&
                        !isNaN(
                            cell.cellTextLines[0].cellWords[1].inferText
                                .trim()
                                .replace('금', '')
                                .replace('원', '')
                                .replace(/,/g, '')
                        )
                );

                if (targetColumnIndex !== -1 && amountIndex !== -1) {
                    const proAmount = parseInt(
                        table.cells[
                            amountIndex
                        ].cellTextLines[0].cellWords[1].inferText
                            .trim()
                            .replace('금', '')
                            .replace('원', '')
                            .replace(/,/g, ''),
                        10
                    );
                    loanEntries.push([number, rowNum, proAmount]);
                    // console.log('근저당 리스트에 추가된 요소: ', [
                    //     number,
                    //     rowNum,
                    //     proAmount,
                    // ]);
                }
            }
        }

        // 전세권 리스트 추가

        if (cell.columnIndex === 0 && cell.cellTextLines.length > 0) {
            const firstWord = cell.cellTextLines[0].cellWords[0];
            if (firstWord && !isNaN(firstWord.inferText.replace(' ', '-'))) {
                const number = firstWord.inferText;
                const rowNum = cell.rowIndex;

                // 근저당권 설정 확인
                const targetColumnIndex = table.cells.findIndex(
                    (cell) =>
                        cell.rowIndex === rowNum &&
                        cell.columnIndex === 1 &&
                        cell.cellTextLines.length > 0 &&
                        cell.cellTextLines[0].cellWords.length > 0 &&
                        cell.cellTextLines[0].cellWords[0].inferText.includes(
                            '전세권'
                        )
                );

                // 같은 row에서 columnIndex 4인 cell에 있는 금액 추출
                const amountIndex = table.cells.findIndex(
                    (cell) =>
                        cell.rowIndex === rowNum &&
                        cell.columnIndex === 4 &&
                        cell.cellTextLines.length > 0 &&
                        cell.cellTextLines[0].cellWords.length > 1 &&
                        !isNaN(
                            cell.cellTextLines[0].cellWords[1].inferText
                                .trim()
                                .replace('금', '')
                                .replace('원', '')
                                .replace(/,/g, '')
                        )
                );

                if (targetColumnIndex !== -1 && amountIndex !== -1) {
                    const proAmount = parseInt(
                        table.cells[
                            amountIndex
                        ].cellTextLines[0].cellWords[1].inferText
                            .trim()
                            .replace('금', '')
                            .replace('원', '')
                            .replace(/,/g, ''),
                        10
                    );
                    leaseEntries.push([number, rowNum, proAmount]);
                    // console.log('근저당 리스트에 추가된 요소: ', [
                    //     number,
                    //     rowNum,
                    //     proAmount,
                    // ]);
                }
            }
        }
    }

    // 근저당권 변경 처리
    for (const cell of table.cells) {
        if (cell.columnIndex === 1 && cell.cellTextLines.length > 0) {
            const cellText = cell.cellTextLines[0].cellWords[0].inferText;
            if (cellText.includes('근저당권변경')) {
                // console.log('변경은 감지');

                const targetChangeNum = cellText.match(/(\d+)번/);
                let targetNumber = targetChangeNum ? targetChangeNum[1] : null;

                if (targetNumber) {
                    targetNumber = targetNumber.trim();
                    // console.log('변경대상 번호: ', targetNumber);

                    // 찾기
                    const changeIndex = loanEntries.findIndex(
                        (entry) => entry[0] === targetNumber
                    );

                    if (changeIndex !== -1) {
                        const rowNum = cell.rowIndex;

                        // 변경될 금액 추출
                        const changeAmountIndex = table.cells.findIndex(
                            (cell) =>
                                cell.rowIndex === rowNum &&
                                cell.columnIndex === 4 &&
                                cell.cellTextLines.length > 0 &&
                                cell.cellTextLines[0].cellWords.length > 1 &&
                                !isNaN(
                                    cell.cellTextLines[0].cellWords[1].inferText
                                        .trim()
                                        .replace('금', '')
                                        .replace('원', '')
                                        .replace(/,/g, '')
                                )
                        );

                        if (changeAmountIndex !== -1) {
                            const changeAmount = parseInt(
                                table.cells[
                                    changeAmountIndex
                                ].cellTextLines[0].cellWords[1].inferText
                                    .trim()
                                    .replace('금', '')
                                    .replace('원', '')
                                    .replace(/,/g, ''),
                                10
                            );

                            // validloanEntries에서 추출된 숫자를 사용해 금액 업데이트
                            loanEntries[changeIndex][2] = changeAmount;
                            // console.log(
                            //     `변경된 금액으로 업데이트: ${targetNumber}번, 변경 금액: ${changeAmount}`
                            // );
                        }
                    } else {
                        // console.log(`대상 번호를 찾지 못함: ${targetNumber}`);
                    }
                } else {
                    // console.log('변경 숫자를 추출하지 못함.');
                }
            }
        }
    }

    // 근저당권 및 전세권 말소 처리
    for (const cell of table.cells) {
        if (cell.columnIndex === 1 && cell.cellTextLines.length > 0) {
            // cellTextLines의 모든 cellWords를 하나의 문자열로 합치기
            const cellTextWord = cell.cellTextLines
                .map((line) =>
                    line.cellWords.map((word) => word.inferText).join('')
                )
                .join('');

            // console.log('cellTextWord: ', cellTextWord);

            // 말소 처리가 필요한 경우(여러개 처리 가능)
            if (cellTextWord.includes('말소')) {
                // console.log('말소 감지: ', cellTextWord);

                const allNumbers = cellTextWord.match(/(\d+)번/g);
                if (allNumbers) {
                    // 역순으로 반복문 실행(splice하면서 배열 크기가 바껴서)
                    for (let i = allNumbers.length - 1; i >= 0; i--) {
                        const targetNumber = allNumbers[i]
                            .match(/(\d+)/)[1]
                            .trim();
                        // console.log('말소 대상 번호: ', targetNumber);

                        // 근저당 말소 처리
                        if (cellTextWord.includes('근저당권')) {
                            const loanIndex = loanEntries.findIndex(
                                (entry) => entry[0] === targetNumber
                            );

                            if (loanIndex !== -1) {
                                loanEntries.splice(loanIndex, 1);
                                // console.log(`근저당권 말소: ${targetNumber}번`);
                            } else {
                                // console.log(
                                //     `대상 번호를 찾지 못함: ${targetNumber}`
                                // );
                            }
                        }

                        // 전세권 말소 처리
                        if (cellTextWord.includes('전세권')) {
                            const leaseIndex = leaseEntries.findIndex(
                                (entry) => entry[0] === targetNumber
                            );

                            if (leaseIndex !== -1) {
                                leaseEntries.splice(leaseIndex, 1);
                                // console.log(`전세권 말소: ${targetNumber}번`);
                            } else {
                                // console.log(
                                //     `대상 번호를 찾지 못함: ${targetNumber}`
                                // );
                            }
                        }
                    }
                }
            }
        }
    }

    // console.log('image별 근저당 entries:', loanEntries);
    // console.log('image별 전세권 entries:', leaseEntries);

    return {
        loanEntries,
        leaseEntries,
    };
}
