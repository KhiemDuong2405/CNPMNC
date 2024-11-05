
const getCoordinates = async (place) => {
    const apiKey = 'acc4500d8f1a4e5ebb0b068849c8cdd1';
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${place}&key=${apiKey}`);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      return { lat, lng };
    } else {
      throw new Error("Không tìm thấy địa điểm");
    }
  };
  export default getCoordinates;
