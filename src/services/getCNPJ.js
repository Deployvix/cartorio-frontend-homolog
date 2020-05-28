// get cnpj. pass unmasked value!!
export const getCNPJ = async (cnpj) => {
  try {
    if (cnpj.length !== 14) return false;

    const options = {
      method: 'GET',
      crossDomain: true,
      dataType: 'jsonp',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };

    const json = await fetch(`https://www.receitaws.com.br/v1/cnpj/${cnpj}`, options)
      .then((answ) => answ.json());

    console.log(json);
    return json;
  } catch (error) {
    console.error(error);
    return false;
  }
};
