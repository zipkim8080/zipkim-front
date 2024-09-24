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

function ocrParse(responseData) {
    let currentSection = 'Pyojeboo'; // 초기 구역을 '표제부'로 설정
    const list = []; // 갑구에서 나오는 항목 저장 리스트

    let address = '';
    let openDate = '';
    let uniqueNumber = '';
    let attachment1 = false;
    let attachment2 = false;
    let trust = false;
    let auction = false;
    let loan = 0;
    let leaseAmount = 0;

    // 각 image의 table 분석
    for (const page of responseData['images']) {
        const tables = page['tables'];

        for (const table of tables || []) {
            const firstCell = table['cells'][0];
            const cellTextLines = firstCell['cellTextLines'];

            // 텍스트 라인 하나씩 처리
            const lines = cellTextLines.map(function (line) {
                const words = line['cellWords'];

                // 각 단어에서 inferText 추출
                const wordTexts = words.map(function (word) {
                    return word['inferText'];
                });

                return wordTexts.join('');
            });

            const firstCellText = lines.join('');

            // 구역 여부 판단 - 이어지는 페이지 고려
            if (firstCellText.includes('갑구')) {
                // console.log('======= 표제부 끝 =======');
                // console.log('======= 갑구 시작 =======');
                currentSection = 'Gabgoo';
            } else if (firstCellText.includes('을구')) {
                // console.log('======= 갑구 끝 =======');
                // console.log('======= 을구 시작 =======');
                currentSection = 'Eulgoo';
            } else {
                // console.log(`${currentSection}가 이어지고 있음`);
            }

            // 각 구역에 대한 로직
            if (currentSection === 'Gabgoo') {
                const { list: gabList } = parse_gabgoo_table(table);
                list.push(...gabList);
                for (let i = 0; i < list.length; i++) {
                    if (list[i] === '압류') attachment1 = true;
                    else if (list[i] === '가압류') attachment2 = true;
                    else if (list[i] === '신탁') trust = true;
                    else if (list[i] === '경매개시결정') auction = true;
                }
            } else if (currentSection === 'Eulgoo') {
                const { loan: parsedLoan, leaseAmount: parsedLease } =
                    parse_elgoo_table(table);
                loan += parsedLoan;
                leaseAmount += parsedLease;
            }
        }
    }

    // console.log('======= 을구 끝 =======');

    // console.log('최종 남은 항목: ', [...new Set(list)]); // 최종 남은 항목 출력
    // console.log(trust, attachment1, attachment2, auction);
    // console.log('총 근저당권 금액: ', loan);
    // console.log('총 전세권 금액: ', leaseAmount);

    const subInfo = subInformation(responseData);
    // console.log('고유번호: ', subInfo.uniqueNumber);
    // console.log('열람일시: ', subInfo.openDate);
    // console.log('주소: ', subInfo.address);

    return {
        trust,
        attachment1,
        attachment2,
        auction,
        loan,
        leaseAmount,
        uniqueNumber: subInfo.uniqueNumber,
        openDate: subInfo.openDate,
        address: subInfo.address,
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

function parse_gabgoo_table(table) {
    const list = [];
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
            // console.log(text);

            // 조건에 따라 경매개시결정/가압류/압류/신탁 추가
            if (text.includes('경매개시결정') && !text.includes('말소')) {
                list.push('경매개시결정');
            } else if (
                (text.includes('가압류') ||
                    text.includes('가업류') ||
                    text.includes('거압류') ||
                    text.includes('거업류') ||
                    text.includes('기압류') ||
                    text.includes('기업류')) &&
                !text.includes('말소')
            ) {
                list.push('가압류');
            } else if (text.includes('압류') && !text.includes('말소')) {
                list.push('압류');
            } else if (text.includes('신탁') && !text.includes('말소')) {
                list.push('신탁');
            }

            // 조건에 따라 경매개시결정/가압류/압류/신탁 제거
            if (
                text.includes('경매개시결정등기말소') &&
                list.includes('경매개시결정')
            ) {
                list.splice(list.indexOf('경매개시결정'), 1);
            } else if (
                text.includes('가압류등기말소') &&
                list.includes('가압류')
            ) {
                list.splice(list.indexOf('가압류'), 1);
            } else if (text.includes('압류등기말소') && list.includes('압류')) {
                list.splice(list.indexOf('압류'), 1);
            } else if (text.includes('신탁등기말소') && list.includes('신탁')) {
                list.splice(list.indexOf('신탁'), 1);
            }
        }
    }

    return { list };
}

// 을구 - 전세권 및 근저당권 정보 검색 및 말소 처리
function parse_elgoo_table(table) {
    const validEntries = []; // 근저당권 정보 저장 리스트
    const leaseEntries = []; // 전세권 정보 저장 리스트
    const cells = table['cells'];

    for (let i = 0; i < cells.length; i++) {
        let cell = cells[i];

        // columnIndex가 0인 경우 처리 => 순위번호 추출
        if (cell['columnIndex'] === 0) {
            const cellTextLines = cell['cellTextLines'];

            if (cellTextLines && cellTextLines.length > 0) {
                const firstWord = cellTextLines[0].cellWords[0];
                if (
                    firstWord &&
                    !isNaN(firstWord.inferText.replace(' ', '-'))
                ) {
                    const number = firstWord.inferText;
                    const rowNum = cell['rowIndex'];

                    // 근저당권 처리 로직
                    const targetColumnIndex = cells.findIndex(
                        (cell) =>
                            cell.rowIndex === rowNum &&
                            cell.columnIndex === 1 &&
                            cell.cellTextLines &&
                            cell.cellTextLines.length > 0 &&
                            cell.cellTextLines[0].cellWords &&
                            cell.cellTextLines[0].cellWords.length > 0 &&
                            cell.cellTextLines[0].cellWords[0].inferText.includes(
                                '근저당권'
                            )
                    );

                    // 전세권 처리 로직
                    const targetColumnIndexLease = cells.findIndex(
                        (cell) =>
                            cell.rowIndex === rowNum &&
                            cell.columnIndex === 1 &&
                            cell.cellTextLines &&
                            cell.cellTextLines.length > 0 &&
                            cell.cellTextLines[0].cellWords &&
                            cell.cellTextLines[0].cellWords.length > 0 &&
                            cell.cellTextLines[0].cellWords[0].inferText.includes(
                                '전세권'
                            )
                    );

                    // 근저당권 금액 추출
                    const amount = cells.findIndex(
                        (cell) =>
                            cell.rowIndex === rowNum &&
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

                    if (targetColumnIndex !== -1 && amount !== -1) {
                        const proAmount = parseInt(
                            cells[
                                amount
                            ].cellTextLines[0].cellWords[1].inferText
                                .trim()
                                .replace('금', '')
                                .replace('원', '')
                                .replace(/,/g, '')
                        );

                        validEntries.push([number, rowNum, proAmount]);
                    }

                    // 전세권 금액 추출
                    if (targetColumnIndexLease !== -1 && amount !== -1) {
                        const leaseAmount = parseInt(
                            cells[
                                amount
                            ].cellTextLines[0].cellWords[1].inferText
                                .trim()
                                .replace('금', '')
                                .replace('원', '')
                                .replace(/,/g, '')
                        );
                        leaseEntries.push([number, rowNum, leaseAmount]);
                    }
                }
            }
        }
    }

    // 말소 처리 로직
    for (let i = 0; i < cells.length; i++) {
        if (cells[i]['columnIndex'] === 1) {
            let realcellWord = '';
            const cellTextLines = cells[i]['cellTextLines'];

            if (cellTextLines && cellTextLines.length > 0) {
                for (let k = 0; k < cellTextLines.length; k++) {
                    const cellWords = cellTextLines[k]['cellWords'];
                    if (cellWords && cellWords.length > 0) {
                        for (let l = 0; l < cellWords.length; l++) {
                            realcellWord += cellWords[l]['inferText'];
                        }
                    }
                }
            }

            // 말소 처리: 두 개의 말소 조건이 있는 경우에도 처리
            const matchPattern = realcellWord.match(/(\d+번.*?말소)/g) || [];

            matchPattern.forEach((pattern) => {
                const targetNum = pattern.trim().replace(/[^\d]/g, ''); // 숫자만 추출

                // 근저당권 말소 처리
                const index = validEntries.findIndex(
                    (entry) => entry[0] == targetNum
                );
                if (index !== -1) {
                    // console.log(
                    //     `근저당권 말소된 순위번호: ${targetNum}번 삭제`
                    // );
                    validEntries.splice(index, 1);
                }

                // 전세권 말소 처리
                const leaseIndex = leaseEntries.findIndex(
                    (entry) => entry[0] == targetNum
                );
                if (leaseIndex !== -1) {
                    // console.log(`전세권 말소된 순위번호: ${targetNum}번 삭제`);
                    leaseEntries.splice(leaseIndex, 1);
                }
            });
        }
    }

    // console.log('최종 근저당액 entries:', validEntries);
    let loan = 0;
    for (let c = 0; c < validEntries.length; c++) {
        loan += validEntries[c][2];
    }

    // console.log('최종 전세권 entries : ', leaseEntries);
    let leaseAmount = 0;
    for (let c = 0; c < leaseEntries.length; c++) {
        leaseAmount += leaseEntries[c][2];
    }

    return {
        loan,
        leaseAmount,
    };
}
