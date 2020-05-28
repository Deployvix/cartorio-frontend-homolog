import axios from 'axios';
// get cep. pass unmasked value!!
export const getCep = async (number) => {
  try {
    if (number.length !== 8) return false;
    const req = await axios.get(`https://viacep.com.br/ws/${number}/json`);
    return req.data;
  } catch (error) {
    console.error(error);
    return false;
  }
};
