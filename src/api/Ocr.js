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
        const validEntries = [];

        for (let i = 0; i < responseData.images.length; i++) {
            if (responseData.images[i].tables) {
                for (let x = 0; x < responseData.images[i].tables.length; x++) {
                    const tableArrays = responseData.images[i].tables[x].cells;
                    for (let j = 0; j < tableArrays.length; j++) {
                        if (
                            tableArrays[j].columnIndex == 0 &&
                            tableArrays[j].cellTextLines &&
                            tableArrays[j].cellTextLines.length > 0 &&
                            tableArrays[j].cellTextLines[0].cellWords &&
                            tableArrays[j].cellTextLines[0].cellWords.length > 0
                        ) {
                            const firstWord =
                                tableArrays[j].cellTextLines[0].cellWords[0];
                            if (
                                firstWord &&
                                !isNaN(firstWord.inferText.replace(' ', '-'))
                            ) {
                                const number = firstWord.inferText;
                                const rowNum = tableArrays[j].rowIndex;

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

                                    validEntries.push([
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
        }

        for (let i = 0; i < responseData.images.length; i++) {
            if (responseData.images[i].tables) {
                for (let x = 0; x < responseData.images[i].tables.length; x++) {
                    const tableArrays = responseData.images[i].tables[x].cells;

                    for (let j = 0; j < tableArrays.length; j++) {
                        if (tableArrays[j].columnIndex == 1) {
                            let realcellWord = '';
                            const cellTextLines = tableArrays[j].cellTextLines;
                            if (cellTextLines && cellTextLines.length > 0) {
                                for (let k = 0; k < cellTextLines.length; k++) {
                                    const cellWords =
                                        cellTextLines[k].cellWords;
                                    if (cellWords && cellWords.length > 0) {
                                        for (
                                            let l = 0;
                                            l < cellWords.length;
                                            l++
                                        ) {
                                            realcellWord +=
                                                cellWords[l].inferText;
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
                                // console.log('realcellWord : ', realcellWord);
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

                                // console.log(realcellWord);
                                // console.log('targetNum: ', targetNum);

                                const index = validEntries.findIndex(
                                    (entry) => entry[0] == targetNum
                                );

                                if (index !== -1) {
                                    console.log(
                                        `말소된 순위번호: ${targetNum}번 삭제`
                                    );
                                    validEntries.splice(index, 1);
                                }

                                if (realcellWord.length > 12 && targetNum2) {
                                    const index2 = validEntries.findIndex(
                                        (entry) => entry[0] == targetNum2
                                    );

                                    if (index2 !== -1) {
                                        console.log(
                                            `말소된 순위번호: ${targetNum2}번 삭제`
                                        );
                                        validEntries.splice(index2, 1);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        console.log('최종 근저당액 entries:', validEntries);
        let loan = 0;
        for (let c = 0; c < validEntries.length; c++) {
            loan += validEntries[c][2];
        }

        return loan;
    };

    const leaseAmount = () => {
        const validEntries2 = []; // 전세권 list

        for (let i = 0; i < responseData.images.length; i++) {
            if (responseData.images[i].tables) {
                for (let x = 0; x < responseData.images[i].tables.length; x++) {
                    const tableArrays = responseData.images[i].tables[x].cells;
                    for (let j = 0; j < tableArrays.length; j++) {
                        if (
                            tableArrays[j].columnIndex == 0 &&
                            tableArrays[j].cellTextLines &&
                            tableArrays[j].cellTextLines.length > 0 &&
                            tableArrays[j].cellTextLines[0].cellWords &&
                            tableArrays[j].cellTextLines[0].cellWords.length > 0
                        ) {
                            const firstWord =
                                tableArrays[j].cellTextLines[0].cellWords[0];
                            if (
                                firstWord &&
                                !isNaN(firstWord.inferText.replace(' ', '-'))
                            ) {
                                const number = firstWord.inferText;
                                const rowNum = tableArrays[j].rowIndex;

                                const targetColumnIndex2 =
                                    tableArrays.findIndex(
                                        (cell) =>
                                            cell.rowIndex === rowNum &&
                                            cell.columnIndex === 1 &&
                                            cell.cellTextLines &&
                                            cell.cellTextLines.length > 0 &&
                                            cell.cellTextLines[0].cellWords &&
                                            cell.cellTextLines[0].cellWords
                                                .length > 0 &&
                                            cell.cellTextLines[0].cellWords[0].inferText.includes(
                                                '전세권'
                                            )
                                    );

                                const amount2 = tableArrays.findIndex(
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

                                if (
                                    targetColumnIndex2 !== -1 &&
                                    amount2 !== -1
                                ) {
                                    const leaseAmount = parseInt(
                                        tableArrays[
                                            amount2
                                        ].cellTextLines[0].cellWords[1].inferText
                                            .trim()
                                            .replace('금', '')
                                            .replace('원', '')
                                            .replace(/,/g, '')
                                    );
                                    validEntries2.push([
                                        number,
                                        rowNum,
                                        leaseAmount,
                                    ]);
                                    console.log(
                                        '전세권 리스트에 추가된 요소:',
                                        [number, rowNum, leaseAmount]
                                    );
                                }
                            }
                        }
                    }
                }
            }
        }

        for (let i = 0; i < responseData.images.length; i++) {
            if (responseData.images[i].tables) {
                for (let x = 0; x < responseData.images[i].tables.length; x++) {
                    const tableArrays = responseData.images[i].tables[x].cells;
                    for (let j = 0; j < tableArrays.length; j++) {
                        if (tableArrays[j].columnIndex == 1) {
                            let realcellWord = '';
                            const cellTextLines = tableArrays[j].cellTextLines;
                            if (cellTextLines && cellTextLines.length > 0) {
                                for (let k = 0; k < cellTextLines.length; k++) {
                                    const cellWords =
                                        cellTextLines[k].cellWords;
                                    if (cellWords && cellWords.length > 0) {
                                        for (
                                            let l = 0;
                                            l < cellWords.length;
                                            l++
                                        ) {
                                            realcellWord +=
                                                cellWords[l].inferText;
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
                                // console.log('realcellWord : ', realcellWord);
                                const targetNum = realcellWord
                                    .trim()
                                    .slice(0, 3)
                                    .replace('번전', '')
                                    .replace('번', '');
                                const index = validEntries2.findIndex(
                                    (entry) => entry[0] == targetNum
                                );

                                if (index !== -1) {
                                    console.log(
                                        `전세권 말소된 순위번호: ${targetNum}번 삭제`
                                    );
                                    validEntries2.splice(index, 1);
                                }
                            }
                        }
                    }
                }
            }
        }
        console.log('최종 전세권 entries : ', validEntries2);
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
        loan: loan(),
        leaseAmount: leaseAmount(),
    };
}
