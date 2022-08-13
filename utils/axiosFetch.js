import axios from 'axios';

export async function axiosFetch(url, data, headers) {

    const config = {
        url: url,
        method: 'POST',
        data: data,
        headers: headers
    }



    try {

        const res = await axios(config);
        // console.log(res);
        return res

    } catch (error) {
        // console.log(error);
        return error
    }
}