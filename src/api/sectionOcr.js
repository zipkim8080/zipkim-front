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
            return extractUniqueAndOpenDate(response.data);
        }
    } catch (error) {
        console.warn('requestWithFile error', error.response);
        throw error;
    }
}

// JSON 데이터를 섹션별로 분리하는 함수
function parseSections(responseData) {
    const sections = {
        pyojeboo: [],
        gabgoo: [],
        eulgoo: [],
    };
    let currentSection = 'pyojeboo'; // 초기 구역을 '표제부'로 설정

    for (const image of responseData.images) {
        for (const table of image.tables || []) {
            for (const cell of table.cells) {
                const cellText = cell.cellTextLines
                    .map((line) =>
                        line.cellWords.map((word) => word.inferText).join('')
                    )
                    .join(' ')
                    .replace(/\s+/g, '')
                    .trim(); // 모든 공백 제거

                // 구역 구분(연결되는 표일 경우 currentSection으로 유지)
                if (cellText.includes('갑구') || cellText.includes('[갑')) {
                    currentSection = 'gabgoo';
                } else if (
                    cellText.includes('을구') ||
                    cellText.includes('[을')
                ) {
                    currentSection = 'eulgoo';
                } else if (cellText.includes('표제부')) {
                    currentSection = 'pyojeboo';
                }

                // 각 섹션에 맞는 테이블 저장
                if (currentSection === 'pyojeboo') {
                    sections.pyojeboo.push(cell);
                } else if (currentSection === 'gabgoo') {
                    sections.gabgoo.push(cell);
                } else if (currentSection === 'eulgoo') {
                    sections.eulgoo.push(cell);
                }
            }
        }
    }
    return sections;
}

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

    // 압류, 가압류, 신탁 여부
    const gabgoo = () => {
        const list = [];

        const sections = parseSections(responseData); // JSON 데이터에서 섹션별로 분리

        for (const table of sections.gabgoo) {
            // 갑구 섹션만 반복
            for (const cell of table.cells) {
                if (cell.columnIndex == 1) {
                    const cellTextLines = cell.cellTextLines;

                    if (cellTextLines && cellTextLines.length > 0) {
                        // 각 라인의 텍스트를 연결하여 하나의 문자열로 만듦
                        const text = cellTextLines
                            .map((line) =>
                                line.cellWords
                                    .map((word) => word.inferText)
                                    .join('')
                            )
                            .join(' ');

                        // 압류/가압류/신탁을 확인하여 리스트에 추가
                        if (
                            text.includes('압류') &&
                            !text.includes('말소') &&
                            !list.includes('압류')
                        ) {
                            list.push('압류');
                        }
                        if (
                            text.includes('가압류') &&
                            !text.includes('말소') &&
                            !list.includes('가압류')
                        ) {
                            list.push('가압류');
                        }
                        if (
                            text.includes('신탁') &&
                            !text.includes('말소') &&
                            !list.includes('신탁')
                        ) {
                            list.push('신탁');
                        }

                        // '등기말소' 텍스트를 포함하면 리스트에서 제거
                        if (
                            text.includes('압류등기말소') &&
                            list.includes('압류')
                        ) {
                            list.splice(list.indexOf('압류'), 1);
                        }
                        if (
                            text.includes('가압류등기말소') &&
                            list.includes('가압류')
                        ) {
                            list.splice(list.indexOf('가압류'), 1);
                        }
                        if (
                            text.includes('신탁등기말소') &&
                            list.includes('신탁')
                        ) {
                            list.splice(list.indexOf('신탁'), 1);
                        }
                    }
                }
            }
        }
        return list;
    };

    const gabgooList = gabgoo();

    const loan = () => {
        const validEntries = [];

        const sections = parseSections(responseData); // JSON 데이터에서 섹션별로 분리
        for (const table of sections.eulgoo) {
            // 을구 섹션만 반복
            for (const cell of table.cells) {
                if (
                    cell.columnIndex == 0 &&
                    cell.cellTextLines &&
                    cell.cellTextLines.length > 0 &&
                    cell.cellTextLines[0].cellWords &&
                    cell.cellTextLines[0].cellWords.length > 0
                ) {
                    const firstWord = cell.cellTextLines[0].cellWords[0];
                    if (
                        firstWord &&
                        !isNaN(firstWord.inferText.replace(' ', '-'))
                    ) {
                        const number = firstWord.inferText;
                        const rowNum = cell.rowIndex;

                        const targetColumnIndex = table.cells.findIndex(
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

                        const amount = table.cells.findIndex(
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
                                table.cells[
                                    amount
                                ].cellTextLines[0].cellWords[1].inferText
                                    .trim()
                                    .replace('금', '')
                                    .replace('원', '')
                                    .replace(/,/g, '')
                            );

                            validEntries.push([number, rowNum, proAmount]);
                        }
                    }
                }
            }
        }

        for (const table of sections.eulgoo) {
            // 을구 섹션만 반복
            for (const cell of table.cells) {
                if (cell.columnIndex == 1) {
                    let realcellWord = '';
                    const cellTextLines = cell.cellTextLines;
                    if (cellTextLines && cellTextLines.length > 0) {
                        for (let k = 0; k < cellTextLines.length; k++) {
                            const cellWords = cellTextLines[k].cellWords;
                            if (cellWords && cellWords.length > 0) {
                                for (let l = 0; l < cellWords.length; l++) {
                                    realcellWord += cellWords[l].inferText;
                                }
                            }
                        }
                    }

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
                        const targetNum = realcellWord
                            .trim()
                            .slice(0, 3)
                            .replace('번근', '')
                            .replace('번', '');

                        let targetNum2;
                        if (realcellWord.length > 12) {
                            targetNum2 = realcellWord
                                .trim()
                                .slice(9, 12)
                                .replace('번근', '')
                                .replace('번', '');
                        }

                        const index = validEntries.findIndex(
                            (entry) => entry[0] == targetNum
                        );

                        if (index !== -1) {
                            validEntries.splice(index, 1);
                        }

                        if (realcellWord.length > 12 && targetNum2) {
                            const index2 = validEntries.findIndex(
                                (entry) => entry[0] == targetNum2
                            );

                            if (index2 !== -1) {
                                validEntries.splice(index2, 1);
                            }
                        }
                    }
                }
            }
        }

        let loan = 0;
        for (let c = 0; c < validEntries.length; c++) {
            loan += validEntries[c][2];
        }

        return loan;
    };

    const leaseAmount = () => {
        const validEntries2 = []; // 전세권 list

        const sections = parseSections(responseData); // JSON 데이터에서 섹션별로 분리
        for (const table of sections.eulgoo) {
            // 을구 섹션만 반복
            for (const cell of table.cells) {
                if (
                    cell.columnIndex == 0 &&
                    cell.cellTextLines &&
                    cell.cellTextLines.length > 0 &&
                    cell.cellTextLines[0].cellWords &&
                    cell.cellTextLines[0].cellWords.length > 0
                ) {
                    const firstWord = cell.cellTextLines[0].cellWords[0];
                    if (
                        firstWord &&
                        !isNaN(firstWord.inferText.replace(' ', '-'))
                    ) {
                        const number = firstWord.inferText;
                        const rowNum = cell.rowIndex;

                        const targetColumnIndex2 = table.cells.findIndex(
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

                        const amount2 = table.cells.findIndex(
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

                        if (targetColumnIndex2 !== -1 && amount2 !== -1) {
                            const leaseAmount = parseInt(
                                table.cells[
                                    amount2
                                ].cellTextLines[0].cellWords[1].inferText
                                    .trim()
                                    .replace('금', '')
                                    .replace('원', '')
                                    .replace(/,/g, '')
                            );
                            validEntries2.push([number, rowNum, leaseAmount]);
                        }
                    }
                }
            }
        }

        for (const table of sections.eulgoo) {
            // 을구 섹션만 반복
            for (const cell of table.cells) {
                if (cell.columnIndex == 1) {
                    let realcellWord = '';
                    const cellTextLines = cell.cellTextLines;
                    if (cellTextLines && cellTextLines.length > 0) {
                        for (let k = 0; k < cellTextLines.length; k++) {
                            const cellWords = cellTextLines[k].cellWords;
                            if (cellWords && cellWords.length > 0) {
                                for (let l = 0; l < cellWords.length; l++) {
                                    realcellWord += cellWords[l].inferText;
                                }
                            }
                        }
                    }

                    if (
                        !isNaN(
                            realcellWord
                                .trim()
                                .slice(0, 3)
                                .replace('번전', '')
                                .replace('번', '')
                        ) &&
                        realcellWord.trim().slice(-2) == '말소'
                    ) {
                        const targetNum = realcellWord
                            .trim()
                            .slice(0, 3)
                            .replace('번전', '')
                            .replace('번', '');
                        const index = validEntries2.findIndex(
                            (entry) => entry[0] == targetNum
                        );

                        if (index !== -1) {
                            validEntries2.splice(index, 1);
                        }
                    }
                }
            }
        }
        let leaseAmount = 0;
        for (let c = 0; c < validEntries2.length; c++) {
            leaseAmount += validEntries2[c][2];
        }

        return leaseAmount;
    };

    return {
        uniqueNumber,
        openDate,
        address: address(),
        gabgooList,
        loan: loan(),
        leaseAmount: leaseAmount(),
    };
}
