const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');

// Função para formatar o JSON em arrays de objetos
function formatJson(jsonData) {
    try {
        const data = JSON.parse(jsonData);
        if (!Array.isArray(data)) {
            throw new Error('O arquivo JSON não contém um array de objetos.');
        }
        return data;
    } catch (error) {
        console.error('Erro ao analisar o arquivo JSON:', error);
        process.exit(1); // Termina o processo em caso de erro
    }
}

// Função para criar o link do vídeo TikTok
function createVideoLink(uniqueId, id) {
    return `https://www.tiktok.com/@${uniqueId}/video/${id}`;
}

// Ler o arquivo JSON
try {
    const jsonData = fs.readFileSync('input.json', 'utf8');
    const data = formatJson(jsonData);

    // Selecionar e achatar elementos específicos
    const selectedData = data.map(item => {
        // Criação do link do vídeo TikTok
        const videoLink = item.id && item.author ? createVideoLink(item.author.uniqueId, item.id) : null;

        return {
            id: item.id || null,
            uniqueId: item.author ? item.author.uniqueId : null,
            nickname: item.author ? item.author.nickname : null,
            verified: item.author ? item.author.verified : null,
            title: item.music ? item.music.title : null,
            desc: item.desc || null,
            isCommerce: item.challenges && item.challenges.length > 0 ? item.challenges[0].isCommerce : null,
            hashtagName: item.challenges && item.challenges.length > 0 ? item.challenges[0].title : null,
            heartCount: item.authorStats ? item.authorStats.heartCount : null,
            videoCount: item.authorStats ? item.authorStats.videoCount : null,
            diggCount: item.stats ? item.stats.diggCount : null,
            shareCount: item.stats ? item.stats.shareCount : null,
            commentCount: item.stats ? item.stats.commentCount : null,
            playCount: item.stats ? item.stats.playCount : null,
            collectCount: item.stats ? item.stats.collectCount : null,
            videoLink: videoLink // Adiciona o link do vídeo TikTok
        };
    });

    // Escrever os dados selecionados em um arquivo JSON
    const formattedJsonFilePath = 'formattedFiles/formatted_data.json';
    fs.writeFileSync(formattedJsonFilePath, JSON.stringify(selectedData, null, 2));

    // Verificar e remover o arquivo CSV existente
    const csvFilePath = 'formattedFiles/formatted_data.csv';
    if (fs.existsSync(csvFilePath)) {
        fs.unlinkSync(csvFilePath);
    }

    // Escrever os dados selecionados em um arquivo CSV
    const csvWriter = createObjectCsvWriter({
        alwaysQuote: true,
        path: csvFilePath,
        header: [
            { id: 'id', title: 'ID' },
            { id: 'uniqueId', title: 'UniqueId' },
            { id: 'nickname', title: 'Nickname' },
            { id: 'verified', title: 'Verified' },
            { id: 'title', title: 'Title' },
            { id: 'desc', title: 'Description' },
            { id: 'isCommerce', title: 'IsCommerce' },
            { id: 'hashtagName', title: 'HashtagName' },
            { id: 'heartCount', title: 'HeartCount' },
            { id: 'videoCount', title: 'VideoCount' },
            { id: 'diggCount', title: 'DiggCount' },
            { id: 'shareCount', title: 'ShareCount' },
            { id: 'commentCount', title: 'CommentCount' },
            { id: 'playCount', title: 'PlayCount' },
            { id: 'collectCount', title: 'CollectCount' },
            { id: 'videoLink', title: 'VideoLink' } // Adiciona a coluna para o link do vídeo TikTok
        ]
    });

    csvWriter.writeRecords(selectedData)
        .then(() => {
            console.log('CSV formatado salvo em formattedFiles/formatted_data.csv');
            console.log('JSON formatado salvo em formattedFiles/formatted_data.json');
        });

} catch (error) {
    console.error('Erro ao ler ou processar o arquivo JSON:', error);
    process.exit(1); // Termina o processo em caso de erro
}
