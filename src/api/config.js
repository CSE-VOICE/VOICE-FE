export const API_BASE_URL = 'http://192.168.45.236:3000';

export const api = async (endpoint, method = 'GET', data = null) => {
  try {
    console.log(`API 요청: ${method} ${endpoint}`, data);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : null,
    });

    const result = await response.json();
    console.log('API 응답:', result);

    // success 필드가 없거나 false이고, error 객체가 있는 경우에만 에러 처리
    if (result.success === false && result.error) {
      throw new Error(result.error.message);
    }

    // success 필드가 없는 경우에도 데이터 반환
    return result.data || result;
  } catch (error) {
    console.error('API 에러:', error);
    throw error;
  }
};
